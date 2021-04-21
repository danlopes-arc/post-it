import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {DatabaseService} from '../../../services/database.service';
import {AuthService} from '../../../services/auth.service';
import {Post} from '../../../models/Post';

@Component({
  selector: 'app-timeline-page',
  templateUrl: './timeline-page.component.html',
  styleUrls: ['./timeline-page.component.css']
})
export class TimelinePageComponent implements OnInit {

  posts: Post[] = [];

  constructor(
    public router: Router,
    private database: DatabaseService,
    private auth: AuthService) {
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  private async loadUsers(): Promise<void> {
    const user = await this.auth.getUser();
    if (!user) {
      return;
    }
    const timelineUsers = (await this.database.users.getFollowed(user)).concat(user);
    for (const usr of timelineUsers) {
      this.posts.push(...(await this.database.posts.getUserPosts(usr)));
    }

    this.posts.sort((p1, p2) => +p2.createdAt - +p1.createdAt);
  }

}
