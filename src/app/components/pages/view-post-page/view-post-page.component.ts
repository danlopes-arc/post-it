import {Component, OnInit} from '@angular/core';
import {Post} from '../../../models/Post';
import {User} from '../../../models/User';
import {ActivatedRoute, Router} from '@angular/router';
import {DatabaseService} from '../../../services/database.service';
import {relativeTime} from 'human-date';
import {AuthService} from '../../../services/auth.service';
import {Comment} from '../../../models/Comment';


@Component({
  selector: 'app-view-post-page',
  templateUrl: './view-post-page.component.html',
  styleUrls: ['./view-post-page.component.css']
})
export class ViewPostPageComponent implements OnInit {

  post: Post | null = null;
  relativeTime = relativeTime;
  postUser: User | null = null;
  authUser: User | null = null;
  postComments: Comment[] = [];
  userComments: Comment[] = [];
  commentators: User[] = [];

  constructor(public router: Router,
              private database: DatabaseService,
              private activatedRoute: ActivatedRoute,
              private auth: AuthService) {
  }

  async ngOnInit(): Promise<void> {
    const {id} = this.activatedRoute.snapshot.params;
    if (!id) {
      await this.router.navigate(['timeline']);
      return;
    }

    this.post = await this.database.posts.findById(id);

    if (!this.post) {
      await this.router.navigate(['timeline']);
      return;
    }
    this.authUser = await this.auth.getUser();
    this.postUser = await this.database.users.getPostUser(this.post);
    this.postComments = await this.database.comments.getPostComments(this.post);
    this.userComments = new Array(...this.postComments);
    this.userComments.filter(c => c.userId === this.authUser?.id);
    for (const comment of this.postComments) {
      const user = await this.database.users.getCommentUser(comment);
      if (user) {
        this.commentators.push(user);
      }
    }
  }

  getCommentator(comment: Comment): User | null {
    for (const user of this.commentators) {
      if (user.id === comment.userId) {
        return user;
      }
    }
    return null;
  }
}
