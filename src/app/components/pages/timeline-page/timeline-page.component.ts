import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {DatabaseService} from '../../../services/database.service';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-timeline-page',
  templateUrl: './timeline-page.component.html',
  styleUrls: ['./timeline-page.component.css']
})
export class TimelinePageComponent implements OnInit {

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
      const users = await this.database.users.getFollowed(user);
    }
  }

}
