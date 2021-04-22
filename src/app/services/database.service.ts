import {Injectable} from '@angular/core';
import {runSql} from '../utils/sql';
import {Repository} from '../utils/repository/Repository';
import {User} from '../models/User';
import {Column} from '../utils/repository/Column';
import {UserRepository} from '../utils/repository/UserRepository';
import {PostRepository} from '../utils/repository/PostRepository';
import {Post} from '../models/Post';
import {Comment} from '../models/Comment';
import {CommentRepository} from '../utils/repository/CommentRepository';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  private readonly database: Database;

  users: UserRepository;
  posts: PostRepository;
  comments: CommentRepository;

  constructor() {
    this.database = window.openDatabase('PostIt', '1.0', 'Post It', 2 * 1024 * 1024);

    this.users = new UserRepository(this.database);
    this.posts = new PostRepository(this.database);
    this.comments = new CommentRepository(this.database);
    // this.resetDatabase();
    this.initializeDatabase();
  }

  async resetDatabase(): Promise<void> {
    const statements = [
      `DROP TABLE IF EXISTS comments;`,
      `DROP TABLE IF EXISTS posts;`,
      `DROP TABLE IF EXISTS followers;`,
      `DROP TABLE IF EXISTS users;`,
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
    await this.seed();
  }

  async initializeDatabase(): Promise<void> {

    const statements = [`
CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
);`, `
CREATE TABLE IF NOT EXISTS followers(
  followerId INTEGER NOT NULL,
  followedId INTEGER NOT NULL,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL,
  PRIMARY KEY(followerId, followedId)
  FOREIGN KEY(followerId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY(followedId) REFERENCES users(id) ON DELETE CASCADE
);`, `
CREATE TABLE IF NOT EXISTS posts(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  latitude REAL,
  longitude REAL,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL,
  FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE
);`, `
CREATE TABLE IF NOT EXISTS comments(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL,
  postId INTEGER NOT NULL,
  body TEXT NOT NULL,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL,
  FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE
  FOREIGN KEY(postId) REFERENCES posts(id) ON DELETE CASCADE
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

    // const comment = new Comment();
    // comment.userId = 2;
    // comment.postId = 1;
    // comment.body = 'hello guys!';
    // console.log(await this.comments.create(comment));

    // ['daniela', 'omara', 'paula', 'ritoa', 'jose', 'cotios'].forEach(async n => {
    //   const user = new User();
    //   user.id = 0;
    //   user.username = n;
    //   console.log(await this.users.create(user));
    // });

    // let count = 0;
    // for (let i = 0; i < 10; i++) {
    //   for (let j = 0; j < i; j++) {
    //     const post = new Post();
    //     post.title = count++ + ' Hello from another planet!';
    //     post.body = 'Just a moderately sizeable text so we have something to test against the app.';
    //     post.userId = i + 1;
    //     await this.posts.create(post);
    //   }
    // }

    // const post = new Post();
    // post.userId = 1;
    // post.title = 'Hello from another planet!';
    // post.body = 'Just a moderately sizeable text so we have something to test against the app.';
    // console.log(await this.posts.create(post));
    // console.log(await this.posts.getUserPosts(await this.users.findById(1) ?? new User()));
    // console.log(await this.users.getPostUser(await this.posts.findById(1) ?? new Post()));

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

  async seed(): Promise<void> {
    const usernames = ['daniel', 'omar', 'paula', 'corato', 'meloga', 'ritoa', 'jose', 'cotios', 'julius', 'tiguan'];
    for (const username of usernames) {
      const user = new User();
      user.id = 0;
      user.username = username;
      await this.users.create(user);
    }

    let count = 0;
    for (let i = 0; i < usernames.length; i++) {
      for (let j = 0; j < i; j++) {
        const post = new Post();
        post.title = `${++count} Hello from another planet! It's great here.`;
        post.body = 'Just a moderately sizeable text so we have something to test against the app.';
        post.userId = i + 1;
        await this.posts.create(post);
      }
    }
  }
}
