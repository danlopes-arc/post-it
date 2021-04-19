import {Column, isValidValue} from './Column';
import {runSql} from '../sql';

export class RepositoryCreationError extends Error {
  constructor(public messages: string[]) {
    super('[Repository Creation Error] not valid');
  }
}

export type ColumnValues = {
  [key: string]: any
};

export class Repository<Model> {
  protected pkColumns: Column[] = [];
  protected editableColumns: Column[] = [];
  protected createTimestampColumns: Column[] = [];
  protected updateTimestampColumns: Column[] = [];
  protected uniqueColumns: Column[] = [];

  protected hasPkWithAutoincrement: boolean;

  constructor(
    protected modelType: new() => Model,
    protected database: Database,
    protected table: string,
    protected columns: Column[],
  ) {
    columns.forEach(column => {
      if (column.isPk) {
        this.pkColumns.push(column);
      }
      if (!column.isAutoIncrement) {
        this.editableColumns.push(column);
      }
      if (!column.isCreateTimestamp) {
        this.createTimestampColumns.push(column);
      }
      if (!column.isUpdateTimestamp) {
        this.updateTimestampColumns.push(column);
      }
      if (!column.isUnique) {
        this.uniqueColumns.push(column);
      }
    });

    const pkAiCount = this.pkColumns.reduce((prev, column) => {
      if (column.isPk && column.isAutoIncrement) {
        return prev + 1;
      }
      return prev;
    }, 0);

    this.hasPkWithAutoincrement = pkAiCount === 1;

    const errors: string[] = [];

    if (this.pkColumns.length === 0) {
      errors.push('There must be at least one pk column');
    }
    if (this.editableColumns.length === 0) {
      errors.push('There must be at least one editable column');
    }

    if (pkAiCount > 1) {
      errors.push('There can be only one pk with autoincrement');
    }

    if (errors.length) {
      throw new RepositoryCreationError(errors);
    }
  }

  protected makeModel(row: any): Model {
    const model = new this.modelType() as any;
    this.columns.forEach(column => model[column.name] = column.convertFromDatabase(row[column.name]));
    return model;
  }

  getPkAndCondition(): string {
    return this.pkColumns
      .map(column => `${column.name} = ?`)
      .join(' AND ');
  }

  getPkValues(model: Model): ColumnValues {
    const pkValues: ColumnValues = {};
    this.pkColumns.forEach(column => pkValues[column.name] = (model as any)[column.name]);
    return pkValues;
  }

  getPkArguments(pk: ColumnValues): any[] {
    const pkCount = Object.getOwnPropertyNames(pk).length;
    if (pkCount !== this.pkColumns.length) {
      throw new Error(`FindById: table ${this.table} has ${this.pkColumns.length} pks, got ${pkCount}`);
    }
    return this.pkColumns.map(column => pk[column.name]);
  }

  getFindWhereCondition(terms: ColumnValues): string {
    const columnNames = Object.getOwnPropertyNames(terms);
    columnNames.forEach(value => {
      const columns = this.columns.filter(c => c.name === value);
      if (!columns.length) {
        throw new Error(`[Error find()] table ${this.table}: column ${value} does not exist`);
      }
    });
    return columnNames
      .map(name => `${name} = ?`)
      .join(' AND ');
  }

  getFindArguments(terms: ColumnValues): any[] {
    const columnNames = Object.getOwnPropertyNames(terms);
    return columnNames
      .map(name => terms[name]);
  }

  getInsertColumnNamesText(): string {
    return this.editableColumns
      .map(column => column.name)
      .join(', ');
  }

  getInsertQuestionMarks(): string {
    return this.editableColumns
      .map(_ => '?')
      .join(', ');
  }

  getInsertArguments(model: Model): any[] {
    const now = new Date();
    return this.editableColumns.map(column => {
      if (column.isCreateTimestamp || column.isUpdateTimestamp) {
        return column.convertToDatabase(now);
      }
      return column.convertToDatabase((model as any)[column.name]);
    });
  }

  protected getUpdateSetText(): string {
    return this.editableColumns
      .map(column => `${column.name} = ?`)
      .join(', ');
  }

  getUpdateArguments(model: Model): any[] {
    const columns = this.editableColumns.concat(this.pkColumns);
    return columns.map(column => {
      if (column.isUpdateTimestamp) {
        return column.convertToDatabase(new Date());
      }
      return column.convertToDatabase((model as any)[column.name]);
    });
  }

  getDeleteArguments(model: Model): any[] {
    return this.pkColumns.map(column => {
      return column.convertToDatabase((model as any)[column.name]);
    });
  }

  async find(terms: ColumnValues | null = null): Promise<Model[]> {
    if (!terms) {
      terms = {};
    }

    let whereCondition = this.getFindWhereCondition(terms);
    if (whereCondition) {
      whereCondition = ' WHERE ' + whereCondition;
    }

    const sql = `SELECT * FROM ${this.table}${whereCondition};`;
    const args = this.getFindArguments(terms);

    try {
      const {rows} = await runSql(this.database, sql, args);
      const models: Model[] = [];
      for (let i = 0; i < rows.length; i++) {
        models.push(this.makeModel(rows.item(i)));
      }
      return models;
    } catch (error) {
      console.error(`[SQL Error] find on table ${this.table}`,
        '\nStatement:', sql,
        '\nArguments:', [],
        '\nError:', error);
    }
    throw new Error();
  }

  async findById(pk: any): Promise<Model | null> {
    if (isValidValue(pk)) {
      pk = {[this.pkColumns[0].name]: pk};
    }

    const sql = `SELECT * FROM ${this.table} WHERE ${this.getPkAndCondition()};`;
    const args = this.getPkArguments(pk);

    try {
      const {rows} = await runSql(this.database, sql, args);
      if (rows.length) {
        return this.makeModel(rows[0]);
      }
      return null;
    } catch (error) {
      console.error(`[SQL Error] findById on table ${this.table}`,
        '\nStatement:', sql,
        '\nArguments:', args,
        '\nError:', error);
      throw new Error();
    }
  }

  async create(model: Model): Promise<Model | null> {
    if (!model) {
      return null;
    }
    const sql = `INSERT INTO ${this.table}(${this.getInsertColumnNamesText()}) VALUES(${this.getInsertQuestionMarks()});`;
    const args = this.getInsertArguments(model);

    try {
      const {insertId} = await runSql(this.database, sql, args);
      if (this.hasPkWithAutoincrement) {
        return await this.findById(insertId);
      }
      return await this.findById(this.getPkValues(model));
    } catch (error) {
      console.error(`[SQL Error] create on table ${this.table}`,
        '\nStatement:', sql,
        '\nArguments:', args,
        '\nError:', error);
      throw new Error();
    }
  }

  async update(model: Model): Promise<Model | null> {
    if (!model) {
      return null;
    }

    const sql = `UPDATE ${this.table} SET ${this.getUpdateSetText()} WHERE ${this.getPkAndCondition()};`;
    const args = this.getUpdateArguments(model);

    try {
      await runSql(this.database, sql, args);
      return await this.findById(this.getPkValues(model));
    } catch (error) {
      console.error(`[SQL Error] update on table ${this.table}`,
        '\nStatement:', sql,
        '\nArguments:', args,
        '\nError:', error);
      throw new Error();
    }
  }

  async delete(model: Model): Promise<boolean> {
    if (!model) {
      return false;
    }
    const sql = `DELETE FROM ${this.table} WHERE ${this.getPkAndCondition()};`;
    const args = this.getDeleteArguments(model);

    try {
      const result = await runSql(this.database, sql, args);
      return !!result.rowsAffected;
    } catch (error) {
      console.error(`[SQL Error] delete on table ${this.table}`,
        '\nStatement:', sql,
        '\nArguments:', args,
        '\nError:', error);
      throw new Error();
    }
  }
}
