import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {User} from '../../../models/User';

@Component({
  selector: 'app-guest-layout',
  templateUrl: './guest-layout.component.html',
  styleUrls: ['./guest-layout.component.css']
})
export class GuestLayoutComponent implements OnInit {

  user: User | null = null;

  constructor(public router: Router, public auth: AuthService) {
  }

  async ngOnInit(): Promise<void> {
    this.user = await this.auth.getUser();
  }

}
