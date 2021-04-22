import {Component, Input, OnInit} from '@angular/core';
import {Comment} from '../../../models/Comment';
import {User} from '../../../models/User';
import {getRelativeTime} from '../../../utils/relativeTime';
import {ActivatedRoute, Router} from '@angular/router';
import {DatabaseService} from '../../../services/database.service';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-comment-card',
  templateUrl: './comment-card.component.html',
  styleUrls: ['./comment-card.component.css']
})
export class CommentCardComponent implements OnInit {

  @Input() comment: Comment | null = null;
  commentUser: User | null = null;
  getRelativeTime = getRelativeTime;
  authUser: User | null = null;

  constructor(public router: Router,
              private database: DatabaseService,
              private auth: AuthService) {
  }

  async ngOnInit(): Promise<void> {
    if (!this.comment) {
      await this.router.navigate(['timeline']);
      return;
    }
    this.authUser = await this.auth.getUser();

    this.commentUser = await this.database.users.getCommentUser(this.comment);
  }

}
