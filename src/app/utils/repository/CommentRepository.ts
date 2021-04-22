import {Repository} from './Repository';
import {Column} from './Column';
import {Post} from '../../models/Post';
import {User} from '../../models/User';
import {Comment} from '../../models/Comment';

export class CommentRepository extends Repository<Comment> {
  constructor(database: Database) {
    super(Comment, database, 'posts', [
      new Column('id', 'integer').withPk().withAutoIncrement(),
      new Column('userId', 'integer'),
      new Column('postId', 'integer'),
      new Column('body', 'string'),
      new Column('createdAt', 'datetime').withCreateTimestamp(),
      new Column('updatedAt', 'datetime').withUpdateTimestamp()
    ]);
  }

  async getPostUserComments(user: User, post: Post): Promise<Comment[]> {
    return await this.find({userId: user.id, postId: post.id});
  }

  async getPostComments(post: Post): Promise<Comment[]> {
    return await this.find({postId: post.id});
  }
}
