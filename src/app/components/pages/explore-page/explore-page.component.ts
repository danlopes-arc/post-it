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
    const user = await this.auth.getUser();
    if (user) {
      this.users = await this.database.users.getNonFollowed(user);
    }
  }

}
