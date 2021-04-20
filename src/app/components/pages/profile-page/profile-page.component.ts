import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {DatabaseService} from '../../../services/database.service';
import {AuthService} from '../../../services/auth.service';
import {User} from '../../../models/User';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {

  user: User | null = null;
  isFollowing = true;
  isAuthUser = false;

  constructor(public router: Router,
              private database: DatabaseService,
              private auth: AuthService) {
  }

  ngOnInit(): void {
    this.loadUser();
  }

  private async loadUser(): Promise<void> {
    this.user = await this.auth.getUser();
  }

  onFollow = async (): Promise<void> => {
    console.log('follow');
  }

  onUnfollow = async (): Promise<void> => {
    console.log('follow');
  }
}
