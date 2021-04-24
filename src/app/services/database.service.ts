import {Injectable} from '@angular/core';
import {runSql} from '../utils/sql';
import {User} from '../models/User';
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
    this.initializeDatabase();
  }

  async clearDatabase(): Promise<void> {
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
  }

  async seedDatabase(): Promise<void> {
    const users = [{
      username: 'daniel',
    }, {
      username: 'Bartholomeo',
    }, {
      username: 'Alaric',
    }, {
      username: 'Evered',
    }, {
      username: 'Lilia',
    }, {
      username: 'Kissiah',
    }, {
      username: 'Alida',
    }, {
      username: 'Filip',
    }, {
      username: 'Dalis',
    }, {
      username: 'Maryann',
    }, {
      username: 'Darrick',
    }, {
      username: 'Alexine',
    }, {
      username: 'Josias',
    }, {
      username: 'Wilhelmina',
    }, {
      username: 'Leticia',
    }];
    const posts = [{
      title: 'Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.',
      body: 'Nam nulla. Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede. Morbi porttitor lorem id ligula.',
      latitude: null,
      longitude: null,
      userId: 15
    }, {
      title: 'Vestibulum ac est lacinia nisi venenatis tristique.',
      body: 'In hac habitasse platea dictumst. Etiam faucibus cursus urna.',
      latitude: 43.415369,
      longitude: -79.938923,
      userId: 12
    }, {
      title: 'In quis justo.',
      body: 'Pellentesque ultrices mattis odio.',
      latitude: 43.520676,
      longitude: -80.602654,
      userId: 10
    }, {
      title: 'Nulla nisl.',
      body: 'Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus vestibulum sagittis sapien. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.',
      latitude: 43.502663,
      longitude: -80.264156,
      userId: 10
    }, {
      title: 'Nunc purus.',
      body: 'Proin leo odio, porttitor id, consequat in, consequat ut, nulla.',
      latitude: null,
      longitude: null,
      userId: 5
    }, {
      title: 'Cras in purus eu magna vulputate luctus.',
      body: 'Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem.',
      latitude: 43.495519,
      longitude: -80.567913,
      userId: 1
    }, {
      title: 'Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo.',
      body: 'Morbi non lectus.',
      latitude: 43.423515,
      longitude: -80.56511,
      userId: 11
    }, {
      title: 'Donec ut mauris eget massa tempor convallis.',
      body: 'Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus.',
      latitude: null,
      longitude: null,
      userId: 3
    }, {
      title: 'Nullam varius.',
      body: 'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Duis faucibus accumsan odio.',
      latitude: 43.412275,
      longitude: -80.682841,
      userId: 8
    }, {
      title: 'Vestibulum rutrum rutrum neque.',
      body: 'In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem.',
      latitude: 43.479583,
      longitude: -80.325393,
      userId: 5
    }, {
      title: 'Nulla nisl.',
      body: 'Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis.',
      latitude: 43.567821,
      longitude: -80.489841,
      userId: 12
    }, {
      title: 'Aliquam quis turpis eget elit sodales scelerisque.',
      body: 'Integer ac leo. Pellentesque ultrices mattis odio. Donec vitae nisi.',
      latitude: null,
      longitude: null,
      userId: 10
    }, {
      title: 'In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem.',
      body: 'Integer a nibh.',
      latitude: null,
      longitude: null,
      userId: 15
    }, {
      title: 'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam.',
      body: 'Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui.',
      latitude: 43.494486,
      longitude: -79.969021,
      userId: 7
    }, {
      title: 'Praesent lectus.',
      body: 'Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede.',
      latitude: 43.522487,
      longitude: -80.414417,
      userId: 7
    }, {
      title: 'Suspendisse potenti.',
      body: 'Praesent id massa id nisl venenatis lacinia. Aenean sit amet justo.',
      latitude: 43.419642,
      longitude: -80.686624,
      userId: 14
    }, {
      title: 'Donec semper sapien a libero.',
      body: 'Quisque porta volutpat erat. Quisque erat eros, viverra eget, congue eget, semper rutrum, nulla.',
      latitude: null,
      longitude: null,
      userId: 7
    }, {
      title: 'Vivamus vel nulla eget eros elementum pellentesque.',
      body: 'Donec dapibus. Duis at velit eu est congue elementum. In hac habitasse platea dictumst.',
      latitude: 43.567964,
      longitude: -79.982934,
      userId: 4
    }, {
      title: 'Vivamus in felis eu sapien cursus vestibulum.',
      body: 'Morbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis.',
      latitude: 43.481102,
      longitude: -79.743223,
      userId: 13
    }, {
      title: 'Vivamus metus arcu, adipiscing molestie, hendrerit at, vulputate vitae, nisl.',
      body: 'Integer non velit. Donec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue.',
      latitude: 43.396268,
      longitude: -79.986537,
      userId: 11
    }, {
      title: 'Nulla justo.',
      body: 'Nam ultrices, libero non mattis pulvinar, nulla pede ullamcorper augue, a suscipit nulla elit ac nulla. Sed vel enim sit amet nunc viverra dapibus. Nulla suscipit ligula in lacus.',
      latitude: 43.512885,
      longitude: -80.324103,
      userId: 6
    }, {
      title: 'Cras non velit nec nisi vulputate nonummy.',
      body: 'Fusce consequat. Nulla nisl.',
      latitude: null,
      longitude: null,
      userId: 15
    }, {
      title: 'Suspendisse potenti.',
      body: 'Duis consequat dui nec nisi volutpat eleifend.',
      latitude: null,
      longitude: null,
      userId: 4
    }, {
      title: 'Donec odio justo, sollicitudin ut, suscipit a, feugiat et, eros.',
      body: 'Quisque erat eros, viverra eget, congue eget, semper rutrum, nulla.',
      latitude: 43.401662,
      longitude: -80.246816,
      userId: 2
    }, {
      title: 'Morbi sem mauris, laoreet ut, rhoncus aliquet, pulvinar sed, nisl.',
      body: 'Donec quis orci eget orci vehicula condimentum. Curabitur in libero ut massa volutpat convallis.',
      latitude: null,
      longitude: null,
      userId: 9
    }, {
      title: 'Nam congue, risus semper porta volutpat, quam pede lobortis ligula, sit amet eleifend pede libero quis orci.',
      body: 'Cras non velit nec nisi vulputate nonummy. Maecenas tincidunt lacus at velit. Vivamus vel nulla eget eros elementum pellentesque.',
      latitude: 43.386621,
      longitude: -80.26958,
      userId: 14
    }, {
      title: 'Nullam varius.',
      body: 'Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh.',
      latitude: 43.478282,
      longitude: -80.234462,
      userId: 12
    }, {
      title: 'Maecenas rhoncus aliquam lacus.',
      body: 'Etiam vel augue. Vestibulum rutrum rutrum neque. Aenean auctor gravida sem.',
      latitude: null,
      longitude: null,
      userId: 14
    }, {
      title: 'Etiam pretium iaculis justo.',
      body: 'Duis bibendum. Morbi non quam nec dui luctus rutrum.',
      latitude: null,
      longitude: null,
      userId: 15
    }, {
      title: 'Nulla ut erat id mauris vulputate elementum.',
      body: 'Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat.',
      latitude: 43.575432,
      longitude: -80.197687,
      userId: 1
    }, {
      title: 'In hac habitasse platea dictumst.',
      body: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin interdum mauris non ligula pellentesque ultrices. Phasellus id sapien in sapien iaculis congue.',
      latitude: 43.526634,
      longitude: -79.771451,
      userId: 14
    }, {
      title: 'Proin risus.',
      body: 'Suspendisse ornare consequat lectus.',
      latitude: 43.443963,
      longitude: -80.479399,
      userId: 3
    }, {
      title: 'Mauris enim leo, rhoncus sed, vestibulum sit amet, cursus id, turpis.',
      body: 'Nulla tempus.',
      latitude: 43.419376,
      longitude: -80.521268,
      userId: 4
    }, {
      title: 'Duis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa.',
      body: 'Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh. Quisque id justo sit amet sapien dignissim vestibulum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla dapibus dolor vel est.',
      latitude: null,
      longitude: null,
      userId: 2
    }, {
      title: 'Fusce consequat.',
      body: 'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi. Integer ac neque.',
      latitude: null,
      longitude: null,
      userId: 12
    }, {
      title: 'Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede.',
      body: 'Etiam pretium iaculis justo. In hac habitasse platea dictumst. Etiam faucibus cursus urna.',
      latitude: 43.447759,
      longitude: -80.698637,
      userId: 6
    }, {
      title: 'Proin risus.',
      body: 'Donec quis orci eget orci vehicula condimentum. Curabitur in libero ut massa volutpat convallis.',
      latitude: 43.560408,
      longitude: -80.482049,
      userId: 13
    }, {
      title: 'In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem.',
      body: 'Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem.',
      latitude: null,
      longitude: null,
      userId: 7
    }, {
      title: 'Duis bibendum.',
      body: 'Vivamus in felis eu sapien cursus vestibulum.',
      latitude: 43.534569,
      longitude: -80.743821,
      userId: 3
    }, {
      title: 'Vestibulum quam sapien, varius ut, blandit non, interdum in, ante.',
      body: 'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam. Suspendisse potenti.',
      latitude: 43.553816,
      longitude: -80.779915,
      userId: 3
    }, {
      title: 'Maecenas tincidunt lacus at velit.',
      body: 'Nunc nisl. Duis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa. Donec dapibus.',
      latitude: 43.463214,
      longitude: -80.054138,
      userId: 10
    }, {
      title: 'Praesent id massa id nisl venenatis lacinia.',
      body: 'Nulla nisl. Nunc nisl.',
      latitude: 43.402331,
      longitude: -79.84422,
      userId: 10
    }, {
      title: 'Etiam vel augue.',
      body: 'Duis at velit eu est congue elementum. In hac habitasse platea dictumst.',
      latitude: 43.564371,
      longitude: -80.259271,
      userId: 4
    }, {
      title: 'Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante.',
      body: 'Proin leo odio, porttitor id, consequat in, consequat ut, nulla. Sed accumsan felis.',
      latitude: 43.586184,
      longitude: -80.175455,
      userId: 10
    }, {
      title: 'Vivamus metus arcu, adipiscing molestie, hendrerit at, vulputate vitae, nisl.',
      body: 'In hac habitasse platea dictumst. Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem.',
      latitude: 43.458464,
      longitude: -80.485126,
      userId: 7
    }, {
      title: 'Praesent blandit lacinia erat.',
      body: 'Nullam sit amet turpis elementum ligula vehicula consequat. Morbi a ipsum.',
      latitude: null,
      longitude: null,
      userId: 12
    }, {
      title: 'Aliquam non mauris.',
      body: 'Cras in purus eu magna vulputate luctus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus.',
      latitude: 43.532001,
      longitude: -80.291654,
      userId: 13
    }, {
      title: 'Praesent blandit lacinia erat.',
      body: 'Maecenas pulvinar lobortis est. Phasellus sit amet erat.',
      latitude: null,
      longitude: null,
      userId: 3
    }, {
      title: 'Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem.',
      body: 'Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo.',
      latitude: 43.475363,
      longitude: -80.654417,
      userId: 14
    }, {
      title: 'In eleifend quam a odio.',
      body: 'Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci.',
      latitude: 43.443627,
      longitude: -79.877703,
      userId: 5
    }, {
      title: 'Suspendisse potenti.',
      body: 'Nulla ut erat id mauris vulputate elementum. Nullam varius. Nulla facilisi.',
      latitude: 43.55808,
      longitude: -80.223274,
      userId: 1
    }, {
      title: 'Vivamus tortor.',
      body: 'Pellentesque ultrices mattis odio. Donec vitae nisi.',
      latitude: 43.543237,
      longitude: -79.81653,
      userId: 9
    }, {
      title: 'Ut at dolor quis odio consequat varius.',
      body: 'Proin risus. Praesent lectus. Vestibulum quam sapien, varius ut, blandit non, interdum in, ante.',
      latitude: null,
      longitude: null,
      userId: 12
    }, {
      title: 'Aliquam erat volutpat.',
      body: 'Integer a nibh.',
      latitude: 43.582698,
      longitude: -80.669266,
      userId: 14
    }, {
      title: 'Morbi a ipsum.',
      body: 'Duis at velit eu est congue elementum. In hac habitasse platea dictumst.',
      latitude: null,
      longitude: null,
      userId: 9
    }, {
      title: 'Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede.',
      body: 'Ut at dolor quis odio consequat varius.',
      latitude: null,
      longitude: null,
      userId: 1
    }, {
      title: 'Quisque porta volutpat erat.',
      body: 'In blandit ultrices enim. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin interdum mauris non ligula pellentesque ultrices.',
      latitude: 43.587184,
      longitude: -80.446593,
      userId: 3
    }, {
      title: 'Fusce posuere felis sed lacus.',
      body: 'Suspendisse potenti.',
      latitude: null,
      longitude: null,
      userId: 11
    }, {
      title: 'Nam tristique tortor eu pede.',
      body: 'In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem. Integer tincidunt ante vel ipsum.',
      latitude: 43.417633,
      longitude: -80.046255,
      userId: 11
    }, {
      title: 'Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci.',
      body: 'Nulla ac enim. In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem. Duis aliquam convallis nunc.',
      latitude: 43.534371,
      longitude: -80.614269,
      userId: 3
    }, {
      title: 'Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede.',
      body: 'Mauris enim leo, rhoncus sed, vestibulum sit amet, cursus id, turpis. Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci. Mauris lacinia sapien quis libero.',
      latitude: 43.468884,
      longitude: -80.422124,
      userId: 9
    }, {
      title: 'Donec dapibus.',
      body: 'Curabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem.',
      latitude: null,
      longitude: null,
      userId: 6
    }, {
      title: 'Cras pellentesque volutpat dui.',
      body: 'Sed accumsan felis.',
      latitude: 43.583699,
      longitude: -80.344179,
      userId: 3
    }, {
      title: 'Sed sagittis.',
      body: 'Nulla tempus.',
      latitude: 43.477698,
      longitude: -80.034656,
      userId: 3
    }, {
      title: 'In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem.',
      body: 'In quis justo. Maecenas rhoncus aliquam lacus. Morbi quis tortor id nulla ultrices aliquet.',
      latitude: 43.574544,
      longitude: -80.255918,
      userId: 9
    }, {
      title: 'Fusce consequat.',
      body: 'Duis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa. Donec dapibus.',
      latitude: null,
      longitude: null,
      userId: 3
    }, {
      title: 'In hac habitasse platea dictumst.',
      body: 'Etiam faucibus cursus urna. Ut tellus.',
      latitude: 43.518665,
      longitude: -79.9909,
      userId: 2
    }, {
      title: 'Nunc purus.',
      body: 'Duis bibendum. Morbi non quam nec dui luctus rutrum.',
      latitude: 43.464473,
      longitude: -80.495477,
      userId: 2
    }, {
      title: 'Sed sagittis.',
      body: 'Morbi vel lectus in quam fringilla rhoncus. Mauris enim leo, rhoncus sed, vestibulum sit amet, cursus id, turpis.',
      latitude: null,
      longitude: null,
      userId: 8
    }, {
      title: 'Donec posuere metus vitae ipsum.',
      body: 'Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat.',
      latitude: null,
      longitude: null,
      userId: 5
    }, {
      title: 'Suspendisse ornare consequat lectus.',
      body: 'Nullam porttitor lacus at turpis.',
      latitude: 43.443542,
      longitude: -80.135738,
      userId: 14
    }, {
      title: 'Praesent blandit lacinia erat.',
      body: 'Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus vestibulum sagittis sapien.',
      latitude: 43.398102,
      longitude: -80.556385,
      userId: 1
    }, {
      title: 'In hac habitasse platea dictumst.',
      body: 'Nam dui.',
      latitude: 43.582887,
      longitude: -79.816139,
      userId: 4
    }, {
      title: 'Proin at turpis a pede posuere nonummy.',
      body: 'Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci.',
      latitude: 43.386863,
      longitude: -79.916303,
      userId: 15
    }, {
      title: 'Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante.',
      body: 'Ut tellus. Nulla ut erat id mauris vulputate elementum. Nullam varius.',
      latitude: null,
      longitude: null,
      userId: 3
    }];
    const comments = [{
      userId: 9,
      postId: 9,
      body: 'Quisque porta volutpat erat.'
    }, {
      userId: 2,
      postId: 14,
      body: 'Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui.'
    }, {
      userId: 6,
      postId: 12,
      body: 'In blandit ultrices enim. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin interdum mauris non ligula pellentesque ultrices.'
    }, {
      userId: 14,
      postId: 15,
      body: 'Nullam porttitor lacus at turpis. Donec posuere metus vitae ipsum.'
    }, {
      userId: 7,
      postId: 15,
      body: 'Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede. Morbi porttitor lorem id ligula. Suspendisse ornare consequat lectus.'
    }, {
      userId: 12,
      postId: 11,
      body: 'Proin risus. Praesent lectus. Vestibulum quam sapien, varius ut, blandit non, interdum in, ante.'
    }, {
      userId: 10,
      postId: 13,
      body: 'Nam nulla. Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede.'
    }, {
      userId: 9,
      postId: 15,
      body: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin risus. Praesent lectus.'
    }, {
      userId: 10,
      postId: 8,
      body: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin interdum mauris non ligula pellentesque ultrices.'
    }, {
      userId: 9,
      postId: 3,
      body: 'Fusce posuere felis sed lacus. Morbi sem mauris, laoreet ut, rhoncus aliquet, pulvinar sed, nisl.'
    }, {
      userId: 15,
      postId: 12,
      body: 'Quisque id justo sit amet sapien dignissim vestibulum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla dapibus dolor vel est. Donec odio justo, sollicitudin ut, suscipit a, feugiat et, eros.'
    }, {
      userId: 4,
      postId: 15,
      body: 'Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus vestibulum sagittis sapien.'
    }, {
      userId: 5,
      postId: 8,
      body: 'Vestibulum ac est lacinia nisi venenatis tristique. Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue.'
    }, {
      userId: 5,
      postId: 14,
      body: 'Duis mattis egestas metus.'
    }, {
      userId: 10,
      postId: 14,
      body: 'Donec dapibus. Duis at velit eu est congue elementum.'
    }, {
      userId: 8,
      postId: 3,
      body: 'Pellentesque ultrices mattis odio.'
    }, {
      userId: 12,
      postId: 14,
      body: 'Duis mattis egestas metus. Aenean fermentum. Donec ut mauris eget massa tempor convallis.'
    }, {
      userId: 3,
      postId: 14,
      body: 'Aenean auctor gravida sem. Praesent id massa id nisl venenatis lacinia.'
    }, {
      userId: 7,
      postId: 4,
      body: 'Nulla suscipit ligula in lacus. Curabitur at ipsum ac tellus semper interdum.'
    }, {
      userId: 11,
      postId: 11,
      body: 'In hac habitasse platea dictumst.'
    }, {
      userId: 10,
      postId: 8,
      body: 'Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus vestibulum sagittis sapien. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.'
    }, {
      userId: 8,
      postId: 15,
      body: 'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Duis faucibus accumsan odio. Curabitur convallis. Duis consequat dui nec nisi volutpat eleifend.'
    }, {
      userId: 2,
      postId: 6,
      body: 'Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus.'
    }, {
      userId: 3,
      postId: 14,
      body: 'Vivamus metus arcu, adipiscing molestie, hendrerit at, vulputate vitae, nisl. Aenean lectus.'
    }, {
      userId: 9,
      postId: 3,
      body: 'Cras non velit nec nisi vulputate nonummy.'
    }, {
      userId: 15,
      postId: 15,
      body: 'Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat.'
    }, {
      userId: 14,
      postId: 4,
      body: 'Praesent id massa id nisl venenatis lacinia.'
    }, {
      userId: 7,
      postId: 15,
      body: 'Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem. Fusce consequat.'
    }, {
      userId: 8,
      postId: 3,
      body: 'Duis bibendum. Morbi non quam nec dui luctus rutrum. Nulla tellus.'
    }, {
      userId: 3,
      postId: 10,
      body: 'Nullam varius.'
    }, {
      userId: 8,
      postId: 12,
      body: 'Duis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa.'
    }, {
      userId: 14,
      postId: 3,
      body: 'Mauris sit amet eros.'
    }, {
      userId: 13,
      postId: 13,
      body: 'Aliquam non mauris. Morbi non lectus.'
    }, {
      userId: 14,
      postId: 7,
      body: 'Pellentesque eget nunc. Donec quis orci eget orci vehicula condimentum.'
    }, {
      userId: 4,
      postId: 4,
      body: 'Vestibulum ac est lacinia nisi venenatis tristique. Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue. Aliquam erat volutpat.'
    }, {
      userId: 15,
      postId: 10,
      body: 'Integer non velit. Donec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue.'
    }, {
      userId: 4,
      postId: 11,
      body: 'Nullam varius. Nulla facilisi. Cras non velit nec nisi vulputate nonummy.'
    }, {
      userId: 1,
      postId: 1,
      body: 'Nam tristique tortor eu pede.'
    }, {
      userId: 3,
      postId: 6,
      body: 'Nulla mollis molestie lorem.'
    }, {
      userId: 1,
      postId: 4,
      body: 'Nam dui. Proin leo odio, porttitor id, consequat in, consequat ut, nulla.'
    }, {
      userId: 3,
      postId: 15,
      body: 'Proin leo odio, porttitor id, consequat in, consequat ut, nulla.'
    }, {
      userId: 8,
      postId: 2,
      body: 'Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui. Maecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc.'
    }, {
      userId: 11,
      postId: 11,
      body: 'Duis bibendum. Morbi non quam nec dui luctus rutrum.'
    }, {
      userId: 8,
      postId: 12,
      body: 'Maecenas rhoncus aliquam lacus. Morbi quis tortor id nulla ultrices aliquet. Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo.'
    }, {
      userId: 5,
      postId: 2,
      body: 'Cras non velit nec nisi vulputate nonummy. Maecenas tincidunt lacus at velit. Vivamus vel nulla eget eros elementum pellentesque.'
    }, {
      userId: 2,
      postId: 4,
      body: 'Maecenas rhoncus aliquam lacus.'
    }, {
      userId: 9,
      postId: 6,
      body: 'Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo.'
    }, {
      userId: 12,
      postId: 9,
      body: 'Proin risus.'
    }, {
      userId: 3,
      postId: 2,
      body: 'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam. Suspendisse potenti. Nullam porttitor lacus at turpis.'
    }, {
      userId: 4,
      postId: 3,
      body: 'Nam nulla.'
    }, {
      userId: 9,
      postId: 1,
      body: 'Suspendisse potenti. Nullam porttitor lacus at turpis. Donec posuere metus vitae ipsum.'
    }, {
      userId: 3,
      postId: 8,
      body: 'Etiam vel augue. Vestibulum rutrum rutrum neque.'
    }, {
      userId: 13,
      postId: 1,
      body: 'Pellentesque eget nunc.'
    }, {
      userId: 15,
      postId: 2,
      body: 'Phasellus id sapien in sapien iaculis congue.'
    }, {
      userId: 7,
      postId: 15,
      body: 'Proin risus. Praesent lectus. Vestibulum quam sapien, varius ut, blandit non, interdum in, ante.'
    }, {
      userId: 3,
      postId: 8,
      body: 'Morbi a ipsum.'
    }, {
      userId: 11,
      postId: 14,
      body: 'In quis justo. Maecenas rhoncus aliquam lacus.'
    }, {
      userId: 8,
      postId: 12,
      body: 'Vestibulum rutrum rutrum neque. Aenean auctor gravida sem. Praesent id massa id nisl venenatis lacinia.'
    }, {
      userId: 8,
      postId: 2,
      body: 'Morbi a ipsum. Integer a nibh. In quis justo.'
    }, {
      userId: 12,
      postId: 6,
      body: 'Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat. Praesent blandit.'
    }, {
      userId: 10,
      postId: 5,
      body: 'Cras mi pede, malesuada in, imperdiet et, commodo vulputate, justo. In blandit ultrices enim.'
    }, {
      userId: 8,
      postId: 10,
      body: 'Vestibulum ac est lacinia nisi venenatis tristique.'
    }, {
      userId: 5,
      postId: 15,
      body: 'Proin eu mi. Nulla ac enim. In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem.'
    }, {
      userId: 6,
      postId: 15,
      body: 'Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus.'
    }, {
      userId: 7,
      postId: 12,
      body: 'Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue.'
    }, {
      userId: 8,
      postId: 8,
      body: 'Cras non velit nec nisi vulputate nonummy.'
    }, {
      userId: 4,
      postId: 14,
      body: 'Proin leo odio, porttitor id, consequat in, consequat ut, nulla. Sed accumsan felis. Ut at dolor quis odio consequat varius.'
    }, {
      userId: 11,
      postId: 4,
      body: 'Vestibulum rutrum rutrum neque.'
    }, {
      userId: 1,
      postId: 11,
      body: 'Mauris sit amet eros. Suspendisse accumsan tortor quis turpis. Sed ante.'
    }, {
      userId: 12,
      postId: 2,
      body: 'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi. Integer ac neque.'
    }, {
      userId: 9,
      postId: 5,
      body: 'Quisque id justo sit amet sapien dignissim vestibulum.'
    }, {
      userId: 10,
      postId: 11,
      body: 'Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue. Aliquam erat volutpat. In congue.'
    }, {
      userId: 7,
      postId: 9,
      body: 'Curabitur in libero ut massa volutpat convallis. Morbi odio odio, elementum eu, interdum eu, tincidunt in, leo. Maecenas pulvinar lobortis est.'
    }, {
      userId: 6,
      postId: 9,
      body: 'Mauris enim leo, rhoncus sed, vestibulum sit amet, cursus id, turpis. Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci.'
    }, {
      userId: 6,
      postId: 3,
      body: 'Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem.'
    }, {
      userId: 3,
      postId: 13,
      body: 'In hac habitasse platea dictumst. Etiam faucibus cursus urna.'
    }, {
      userId: 2,
      postId: 15,
      body: 'Fusce posuere felis sed lacus. Morbi sem mauris, laoreet ut, rhoncus aliquet, pulvinar sed, nisl. Nunc rhoncus dui vel sem.'
    }, {
      userId: 4,
      postId: 10,
      body: 'Donec vitae nisi. Nam ultrices, libero non mattis pulvinar, nulla pede ullamcorper augue, a suscipit nulla elit ac nulla. Sed vel enim sit amet nunc viverra dapibus.'
    }, {
      userId: 14,
      postId: 3,
      body: 'Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem. Fusce consequat.'
    }, {
      userId: 9,
      postId: 11,
      body: 'Duis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa. Donec dapibus.'
    }, {
      userId: 7,
      postId: 9,
      body: 'Nullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.'
    }, {
      userId: 1,
      postId: 7,
      body: 'Sed accumsan felis. Ut at dolor quis odio consequat varius.'
    }, {
      userId: 3,
      postId: 2,
      body: 'Nulla nisl. Nunc nisl.'
    }, {
      userId: 12,
      postId: 10,
      body: 'Sed vel enim sit amet nunc viverra dapibus. Nulla suscipit ligula in lacus.'
    }, {
      userId: 9,
      postId: 11,
      body: 'Morbi porttitor lorem id ligula. Suspendisse ornare consequat lectus.'
    }, {
      userId: 1,
      postId: 3,
      body: 'Nulla ac enim. In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem. Duis aliquam convallis nunc.'
    }, {
      userId: 11,
      postId: 2,
      body: 'Vivamus tortor.'
    }, {
      userId: 6,
      postId: 14,
      body: 'Phasellus id sapien in sapien iaculis congue.'
    }, {
      userId: 12,
      postId: 15,
      body: 'Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante.'
    }, {
      userId: 6,
      postId: 3,
      body: 'Mauris enim leo, rhoncus sed, vestibulum sit amet, cursus id, turpis. Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci. Mauris lacinia sapien quis libero.'
    }, {
      userId: 2,
      postId: 9,
      body: 'Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis. Fusce posuere felis sed lacus.'
    }, {
      userId: 2,
      postId: 14,
      body: 'Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante.'
    }, {
      userId: 1,
      postId: 13,
      body: 'Nam ultrices, libero non mattis pulvinar, nulla pede ullamcorper augue, a suscipit nulla elit ac nulla.'
    }, {
      userId: 11,
      postId: 10,
      body: 'Sed sagittis.'
    }, {
      userId: 2,
      postId: 4,
      body: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin risus. Praesent lectus.'
    }, {
      userId: 15,
      postId: 14,
      body: 'Nunc rhoncus dui vel sem.'
    }, {
      userId: 11,
      postId: 3,
      body: 'Ut tellus.'
    }, {
      userId: 2,
      postId: 3,
      body: 'Morbi vel lectus in quam fringilla rhoncus. Mauris enim leo, rhoncus sed, vestibulum sit amet, cursus id, turpis.'
    }, {
      userId: 13,
      postId: 11,
      body: 'Etiam justo. Etiam pretium iaculis justo. In hac habitasse platea dictumst.'
    }, {
      userId: 7,
      postId: 3,
      body: 'Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Etiam vel augue. Vestibulum rutrum rutrum neque.'
    }];

    for (const u of users) {
      const user = new User();
      if (u.username.length > 6) {
        u.username = u.username.substr(0, 6);
      }
      user.username = u.username.toLowerCase();
      await this.users.create(user);
    }

    for (const p of posts) {
      const post = new Post();
      if (p.title.length > 60) {
        p.title = p.title.substr(0, 60);
      }
      if (p.body.length > 300) {
        p.body = p.body.substr(0, 300);
      }
      post.title = p.title;
      post.body = p.body;
      post.userId = p.userId;
      post.latitude = p.latitude;
      post.longitude = p.longitude;
      await this.posts.create(post);
    }

    for (const c of comments) {
      if (c.body.length > 300) {
        c.body = c.body.substr(0, 300);
      }
      const comment = new Comment();
      comment.body = c.body;
      comment.userId = c.userId;
      comment.postId = c.postId;
      await this.comments.create(comment);
    }
  }

}
