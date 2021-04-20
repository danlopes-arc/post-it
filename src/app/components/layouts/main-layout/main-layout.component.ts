import {Component, OnInit} from '@angular/core';
import {User} from '../../../models/User';
import {Router} from '@angular/router';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent implements OnInit {

  user: User | null = null;

  constructor(public router: Router, public auth: AuthService) {
  }

  async ngOnInit(): Promise<void> {
    this.user = await this.auth.getUser();
  }

  async onLogout(): Promise<void> {
    await this.auth.logout();
    this.user = null;
    await this.router.navigate(['']);
  }
}
