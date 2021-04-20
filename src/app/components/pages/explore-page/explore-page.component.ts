import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {DatabaseService} from '../../../services/database.service';
import {User} from '../../../models/User';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-explore-page',
  templateUrl: './explore-page.component.html',
  styleUrls: ['./explore-page.component.css']
})
export class ExplorePageComponent implements OnInit {

  users: User[] = [];
  following: User[] = [];
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
      this.users = await this.database.users.getNonFollowed(this.authUser);
    }
  }

  onFollow = async (user: User): Promise<void> => {
    if (!this.authUser) {
      return;
    }
    await this.database.users.addFollower(this.authUser, user);
    this.following.push(user);
  }

  onUnfollow = async (user: User): Promise<void> => {
    if (!this.authUser) {
      return;
    }
    await this.database.users.removeFollower(this.authUser, user);
    this.following.splice(this.following.indexOf(user), 1);
  }
}
