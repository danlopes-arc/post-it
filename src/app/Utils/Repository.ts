import {runSql} from './sql';

export class Repository<Model> {
  constructor(
    protected database: Database,
    protected table: string,
    protected columns: string[],
    protected pkColumns: string[],
    protected autoIncrementColumns: string[]
  ) {
  }

  protected getPkAndCondition(): string {
    return this.pkColumns.reduce((prev, column, i) => {
      return `${prev}${column} = ?${i < this.pkColumns.length - 1 ? ' AND ' : ''}`;
    }, '');
  }

  protected getEditableColumns(): string[] {
    return this.columns.filter(c => !this.autoIncrementColumns.includes(c));
  }

  protected getEditableQuestionMarks(): '?'[] {
    return this.getEditableColumns().map(() => '?');
  }

  protected getEditableArguments(model: Model): string[] {
    return this.getEditableColumns().map(column => model[column]);
  }

  protected getPkArguments(model: Model): string[] {
    return this.pkColumns.map(column => model[column]);
  }

  protected getUpdateSetText(): string {
    return this.getEditableColumns().reduce((prev, column, i) => {
      return `${prev}${column} = ?${i < this.pkColumns.length - 1 ? ', ' : ''}`;
    }, '');
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

      return rows;
    } catch (error) {
      console.error(`[SQL Error] find on table ${this.table}:`, error);
    }
  }

  async findById(...ids: number[]): Promise<Model> {
    const sql = `SELECT * FROM ${this.table} WHERE ${this.getPkAndCondition()};`;
    const args = [ids];

    try {
      const {rows} = await runSql(this.database, sql, args);
      // console.info('Book selected');
      return rows[0] ?? null;
    } catch (error) {
      console.error(`[SQL Error] findById on table ${this.table}:`, error);
    }
  }

  async create(model: Model): Promise<Model> {
    const sql = `INSERT INTO ${this.table}(${this.getEditableColumns().join(', ')}) VALUES(${this.getEditableQuestionMarks().join(', ')});`;
    const args = this.getEditableArguments(model);

    try {
      const {rows} = await runSql(this.database, sql, args);
      // console.info('Book inserted');
      return rows[0];
    } catch (error) {
      console.error(`[SQL Error] create on table ${this.table}:`, error);
    }
  }

  async update(model: Model): Promise<Model> {
    const sql = `UPDATE ${this.table} SET (${this.getUpdateSetText()}) WHERE ${this.getPkAndCondition()};`;
    const args = [...this.getEditableArguments(model), ...this.getPkArguments(model)];

    try {
      const {rows} = await runSql(this.database, sql, args);
      // console.info('Book inserted');
      return rows[0];
    } catch (error) {
      console.error(`[SQL Error] update on table ${this.table}:`, error);
    }
  }

  async delete(model: Model): Promise<boolean> {
    const sql = `DELETE FROM ${this.table} WHERE ${this.getPkAndCondition()};`;
    const args = this.getPkArguments(model);

    try {
      const result = await runSql(this.database, sql, args);
      return !!result.rowsAffected;
      // console.info('Book deleted');
    } catch (error) {
      console.error('SQL Error: deleting book:', error);
    }
  }
}

