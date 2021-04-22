import {Component, Input, OnInit} from '@angular/core';
import {User} from '../../../models/User';
import {Router} from '@angular/router';
import {Post} from '../../../models/Post';
import {DatabaseService} from '../../../services/database.service';
import {getRelativeTime} from '../../../utils/relativeTime';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.css']
})
export class UserCardComponent implements OnInit {

  getRelativeTime = getRelativeTime;
  lastPost: Post | null = null;
  postCount = 0;

  constructor(public router: Router,
              private database: DatabaseService) {
  }

  @Input() user: User | null = null;
  @Input() isUndoAction = false;
  @Input() doActionName = 'do';
  @Input() undoActionName = 'undo';

  @Input() onDo = (user: User) => null as any;
  @Input() onUndo = (user: User) => null as any;

  async ngOnInit(): Promise<void> {
    if (!this.user) {
      return;
    }
    const posts = await this.database.posts.getUserPosts(this.user);
    this.postCount = posts.length;
    if (!this.postCount) {
      return;
    }
    this.lastPost = posts[posts.length - 1];
  }

}
