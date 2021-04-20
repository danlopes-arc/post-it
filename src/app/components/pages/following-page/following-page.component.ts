import { Component, OnInit } from '@angular/core';
import {User} from '../../../models/User';
import {Router} from '@angular/router';
import {DatabaseService} from '../../../services/database.service';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-following-page',
  templateUrl: './following-page.component.html',
  styleUrls: ['./following-page.component.css']
})
export class FollowingPageComponent implements OnInit {

  users: User[] = [];
  notFollowing: User[] = [];
  authUser: User | null = null;

  constructor(
    public router: Router,
    private database: DatabaseService,
    private auth: AuthService
  ) {
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  private async loadUsers(): Promise<void> {
    this.authUser = await this.auth.getUser();
    if (this.authUser) {
      this.users = await this.database.users.getFollowed(this.authUser);
    }
  }

  onFollow = async (user: User): Promise<void> => {
    if (!this.authUser) {
      return;
    }
    await this.database.users.addFollower(this.authUser, user);
    console.log();
    this.notFollowing.splice(this.notFollowing.indexOf(user), 1);
  }

  onUnfollow = async (user: User): Promise<void> => {
    if (!this.authUser) {
      return;
    }
    await this.database.users.removeFollower(this.authUser, user);
    this.notFollowing.push(user);
  }

}
