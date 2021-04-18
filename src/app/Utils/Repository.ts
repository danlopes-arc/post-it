import {runSql} from './sql';

export type PkValues = {
  [key: string]: number
};

export class Repository<Model> {
  constructor(
    protected modelType: new() => Model,
    protected database: Database,
    protected table: string,
    protected columns: string[],
    protected pkColumns: string[],
    protected autoIncrementColumns: string[],
    protected hasTimestamps: boolean
  ) {
  }

  protected getPkAndCondition(): string {
    return this.pkColumns.reduce((prev, column, i) => {
      return `${prev}${column} = ?${i < this.pkColumns.length - 1 ? ' AND ' : ''}`;
    }, '');
  }

  protected getEditableColumns(mode: 'update' | 'create'): string[] {
    const columns = this.columns.filter(c => !this.autoIncrementColumns.includes(c));
    if (this.hasTimestamps) {
      if (mode === 'create') {
        columns.push('createdAt');
      }
      columns.push('updatedAt');
    }
    return columns;
  }

  protected getEditableQuestionMarks(mode: 'update' | 'create'): '?'[] {
    return this.getEditableColumns(mode).map(() => '?');
  }

  protected getEditableArguments(model: Model, mode: 'update' | 'create'): string[] {
    return this.getEditableColumns(mode).map(column => {
      if (this.hasTimestamps && (
        (mode === 'create' && column === 'createdAt') || column === 'updatedAt'
      )) {
          return this.convertToDb(new Date());
      }
      return this.convertToDb(model[column]);
    });
  }

  protected getPkArguments(model: Model): string[] {
    return this.pkColumns.map(column => this.convertToDb(model[column]));
  }

  protected getUpdateSetText(): string {
    return this.getEditableColumns('update').reduce((prev, column, i, array) => {
      return `${prev}${column} = ?${i < array.length - 1 ? ', ' : ''}`;
    }, '');
  }

  protected convertToDb(value: any): string {
    if (value instanceof Date) {
      return value.toISOString();
    }
    return value;
  }

  protected convertFromDb(value: any): any {
    if (typeof value === 'string') {
      const pattern = /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(\.([0-9]+))?(Z)?$/;
      const matches = value.match(pattern);
      if (matches) {
        const year = Number(matches[1]);
        const month = Number(matches[2]);
        const day = Number(matches[3]);
        const hours = Number(matches[4]);
        const minutes = Number(matches[5]);
        const seconds = Number(matches[6]);
        const milliseconds = Number(matches[8] ?? 0);
        return new Date(year, month, day, hours, minutes, seconds, milliseconds);
      }
    }
    return value;
  }

  protected makeModel(row: any): Model {
    if (row == null) {
      return null;
    }

    const model = new this.modelType() as any;
    this.columns.forEach(column => model[column] = this.convertFromDb(row[column]));
    if (this.hasTimestamps) {
      model.createdAt = this.convertFromDb(row.createdAt);
      model.updatedAt = this.convertFromDb(row.updatedAt);
    }
    return model;
  }

  // protected getPkArguments(model: Model): string[] {
  //   return this.pkColumns.reduce<string[]>((prev, column, i) => {
  //     prev.push(model[column]);
  //     return prev;
  //   }, []);
  // }

  async find(): Promise<Model[]> {
    const sql = `SELECT * FROM ${this.table};`;

    try {
      const {rows} = await runSql(this.database, sql);
      // console.info('All books selected');

      return rows.map(row => this.makeModel(row));
    } catch (error) {
      console.error(`[SQL Error] find on table ${this.table}`,
        '\nStatement:', sql,
        '\nArguments:', [],
        '\nError:', error);
    }
  }

  async findById(pk: number | PkValues): Promise<Model> {
    if (typeof pk === 'number') {
      pk = {[this.pkColumns[0]]: pk};
    }
    const ids = this.pkColumns.map(column => pk[column]) as number[];
    const sql = `SELECT * FROM ${this.table} WHERE ${this.getPkAndCondition()};`;
    const args = ids;

    try {
      const {rows} = await runSql(this.database, sql, args);
      // console.info('Book selected');
      return this.makeModel(rows[0]);
    } catch (error) {
      console.error(`[SQL Error] findById on table ${this.table}`,
        '\nStatement:', sql,
        '\nArguments:', args,
        '\nError:', error);
    }
  }

  async create(model: Model): Promise<Model> {
    if (!model) {
      return null;
    }

    const sql = `INSERT INTO ${this.table}(${this.getEditableColumns('create').join(', ')}) VALUES(${this.getEditableQuestionMarks('create').join(', ')});`;
    const args = this.getEditableArguments(model, 'create');

    try {
      const {insertId} = await runSql(this.database, sql, args);
      return await this.findById(insertId);
    } catch (error) {
      console.error(`[SQL Error] create on table ${this.table}`,
        '\nStatement:', sql,
        '\nArguments:', args,
        '\nError:', error);
    }
  }

  async update(model: Model): Promise<Model> {
    if (!model) {
      return null;
    }

    const sql = `UPDATE ${this.table} SET ${this.getUpdateSetText()} WHERE ${this.getPkAndCondition()};`;
    const args = [...this.getEditableArguments(model, 'update'), ...this.getPkArguments(model)];

    try {
      await runSql(this.database, sql, args);
      const pk: PkValues = {};
      const pkArguments = this.getPkArguments(model);
      this.pkColumns.forEach((column, i) => pk[column] = Number(pkArguments[i]));
      return await this.findById(pk);
    } catch (error) {
      console.error(`[SQL Error] update on table ${this.table}`,
        '\nStatement:', sql,
        '\nArguments:', args,
        '\nError:', error);
    }
  }

  async delete(model: Model): Promise<boolean> {
    if (!model) {
      return false;
    }
    const sql = `DELETE FROM ${this.table} WHERE( ${this.getPkAndCondition()};`;
    const args = this.getPkArguments(model);

    try {
      const result = await runSql(this.database, sql, args);
      return !!result.rowsAffected;
      // console.info('Book deleted');
    } catch (error) {
      console.error(`[SQL Error] delete on table ${this.table}`,
        '\nStatement:', sql,
        '\nArguments:', args,
        '\nError:', error);
    }
  }
}

