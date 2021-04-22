import {Component, OnInit} from '@angular/core';
import {Post} from '../../../models/Post';
import {User} from '../../../models/User';
import {ActivatedRoute, Router} from '@angular/router';
import {DatabaseService} from '../../../services/database.service';
import {relativeTime} from 'human-date';
import {AuthService} from '../../../services/auth.service';


@Component({
  selector: 'app-view-post-page',
  templateUrl: './view-post-page.component.html',
  styleUrls: ['./view-post-page.component.css']
})
export class ViewPostPageComponent implements OnInit {

  post: Post | null = null;
  relativeTime = relativeTime;
  user: User | null = null;
  authUser: User | null = null;

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
    this.user = await this.database.users.getPostUser(this.post);

  }

}
