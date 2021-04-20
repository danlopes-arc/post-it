import {Injectable} from '@angular/core';
import {runSql} from '../utils/sql';
import {Repository} from '../utils/repository/Repository';
import {User} from '../models/User';
import {Column} from '../utils/repository/Column';
import {UserRepository} from '../utils/repository/UserRepository';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  private readonly database: Database;

  users: UserRepository;

  constructor() {
    this.database = window.openDatabase('PostIt', '1.0', 'Post It', 2 * 1024 * 1024);

    this.users = new UserRepository(this.database);
    // this.resetDatabase();
    this.initializeDatabase();
  }

  async resetDatabase(): Promise<void> {
    const statements = [
      `DROP TABLE IF EXISTS followers;`,
      `DROP TABLE IF EXISTS users;`
    ];

    for (const statement of statements) {
      try {
        await runSql(this.database, statement);
      } catch (error) {
        console.error(`SQL Error: deleting tables\n` +
          `Statement: ${statement}` +
          'Error:', error);
      }
    }

    await this.initializeDatabase();
  }

  async initializeDatabase(): Promise<void> {

    const statements = [`
CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(255) NOT NULL UNIQUE,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
);`, `
CREATE TABLE IF NOT EXISTS followers(
  followerId INTEGER NOT NULL,
  followedId INTEGER NOT NULL,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL,
  PRIMARY KEY(followerId, followedId)
  FOREIGN KEY(followerId) REFERENCES user(id) ON DELETE CASCADE,
  FOREIGN KEY(followedId) REFERENCES user(id) ON DELETE CASCADE
);`
    ];

    for (const statement of statements) {
      try {
        await runSql(this.database, statement);
      } catch (error) {
        console.error(`SQL Error: creating tables\n` +
          `Statement: ${statement}` +
          'Error:', error);
      }
    }
    // ['daniel', 'omar', 'paul', 'rito'].forEach(async n => {
    //   const user = new User();
    //   user.id = 0;
    //   user.username = n;
    //   console.log(await this.users.create(user));
    // });

    // const user = await this.users.findById(2) ?? new User();
    // if (user) {
    //   console.log(user);
    // user.username = 'daniel';
    // console.log(await this.users.update(user));
    // console.log(await this.users.delete(user));

    // }
    // console.log(await this.users.find({username: 'opa'}));
    // await this.users.removeFollower(
    //   await this.users.findById(1) ?? new User(),
    //   await this.users.findById(2) ?? new User()
    // );
    // console.log(await this.users.getFollowers(user));
  }
}
