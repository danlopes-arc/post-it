import {Repository} from './Repository';
import {User} from '../../models/User';
import {Column} from './Column';
import {runSql} from '../sql';

export class UserRepository extends Repository<User> {
  constructor(database: Database) {
    super(User, database, 'users', [
      new Column('id', 'integer').withPk().withAutoIncrement(),
      new Column('username', 'string').withStringMaxLength(256),
      new Column('createdAt', 'datetime').withCreateTimestamp(),
      new Column('updatedAt', 'datetime').withUpdateTimestamp()
    ]);
  }

  async getFollowers(user: User): Promise<User[]> {
    const sql = `
SELECT * FROM users
WHERE id IN
(
    SELECT followerId FROM followers
    WHERE followedId = ?
);`;

    const args = [user.id];

    try {
      const {rows} = await runSql(this.database, sql, args);
      const users: User[] = [];
      for (let i = 0; i < rows.length; i++) {
        users.push(this.makeModel(rows.item(i)));
      }
      return users;
    } catch (error) {
      console.error(`[SQL Error] getFollowers on table ${this.table}`,
        '\nStatement:', sql,
        '\nArguments:', [],
        '\nError:', error);
    }
    throw new Error();
  }

  async getFollowed(user: User): Promise<User[]> {
    const sql = `
SELECT * FROM users
WHERE id IN
(
    SELECT followedId FROM followers
    WHERE followerId = ?
);`;

    const args = [user.id];

    try {
      const {rows} = await runSql(this.database, sql, args);
      const users: User[] = [];
      for (let i = 0; i < rows.length; i++) {
        users.push(this.makeModel(rows.item(i)));
      }
      return users;
    } catch (error) {
      console.error(`[SQL Error] getFollowed on table ${this.table}`,
        '\nStatement:', sql,
        '\nArguments:', [],
        '\nError:', error);
    }
    throw new Error();
  }

  async addFollower(follower: User, followed: User): Promise<boolean> {
    const sql = `
INSERT INTO followers(followerId, followedId, createdAt, updatedAt)
VALUES(?, ?, ?, ?);`;

    const args = [follower.id, followed.id, new Date(), new Date()];

    try {
      await runSql(this.database, sql, args);
      return true;
    } catch (error) {
      console.error(`[SQL Error] addFollower on table ${this.table}`,
        '\nStatement:', sql,
        '\nArguments:', [],
        '\nError:', error);
    }
    throw new Error();
  }

  async removeFollower(follower: User, followed: User): Promise<boolean> {
    const sql = `DELETE FROM followers WHERE followerId = ? AND followedId = ?;`;

    const args = [follower.id, followed.id];

    try {
      await runSql(this.database, sql, args);
      return true;
    } catch (error) {
      console.error(`[SQL Error] removeFollower on table ${this.table}`,
        '\nStatement:', sql,
        '\nArguments:', [],
        '\nError:', error);
    }
    throw new Error();
  }
}