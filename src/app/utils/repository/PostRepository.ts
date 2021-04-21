import {Repository} from './Repository';
import {Column} from './Column';
import {Post} from '../../models/Post';
import {User} from '../../models/User';

export class PostRepository extends Repository<Post> {
  constructor(database: Database) {
    super(Post, database, 'posts', [
      new Column('id', 'integer').withPk().withAutoIncrement(),
      new Column('userId', 'integer'),
      new Column('title', 'string').withStringMaxLength(256),
      new Column('body', 'string').withStringMaxLength(256),
      new Column('latitude', 'float').withStringMaxLength(256).withNullable(),
      new Column('longitude', 'float').withStringMaxLength(256).withNullable(),
      new Column('createdAt', 'datetime').withCreateTimestamp(),
      new Column('updatedAt', 'datetime').withUpdateTimestamp()
    ]);
  }

  async getUserPosts(user: User): Promise<Post[]> {
    return await this.find({userId: user.id});
  }
}
