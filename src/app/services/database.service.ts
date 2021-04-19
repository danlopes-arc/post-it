import {Injectable} from '@angular/core';
import {runSql} from '../utils/sql';
import {Repository} from '../utils/repository/Repository';
import {User} from '../models/User';
import {Column} from '../utils/repository/Column';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  private readonly database: Database;

  users: Repository<User>;

  constructor() {
    this.database = window.openDatabase('PostIt', '1.0', 'Post It', 2 * 1024 * 1024);

    this.users = new Repository<User>(User, this.database, 'users', [
      new Column('id', 'integer').withPk().withAutoIncrement(),
      new Column('username', 'string').withStringMaxLength(256),
      new Column('createdAt', 'datetime').withCreateTimestamp(),
      new Column('updatedAt', 'datetime').withUpdateTimestamp()
    ]);
    this.initializeDatabase();
  }

  async initializeDatabase(): Promise<void> {

    const sql0 = `
DROP TABLE IF EXISTS users;`;
    const sql = `
CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(255) NOT NULL UNIQUE,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
);`;

    try {
      // await runSql(this.database, sql0);
      await runSql(this.database, sql);
      // console.info('Database opened');
    } catch (error) {
      console.error('SQL Error: creating tables:', error);
    }

    // ['daniel', 'omar', 'paul', 'rito'].forEach(async n => {
    //   const user = new User();
    //   user.id = 0;
    //   user.username = n;
    //   console.log(await this.users.create(user));
    //
    // });

    // const user = await this.users.findById(2);
    // if (user) {
    //   console.log(user);
    // user.username = 'daniel';
    // console.log(await this.users.update(user));
    // console.log(await this.users.delete(user));

    // }
    console.log(await this.users.find({username: 'opa'}));
  }
}
