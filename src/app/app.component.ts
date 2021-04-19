import {Component, OnInit} from '@angular/core';
import {DatabaseService} from './services/database.service';
import {AuthService} from './services/auth.service';
import {User} from './models/User';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'post-it';
  user: User | null = null;
  constructor(private database: DatabaseService, private auth: AuthService) {
  }

  async ngOnInit(): Promise<void> {
    this.user = await this.auth.getUser();
  }
}
