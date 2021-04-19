import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-auth-route',
  templateUrl: './auth-route.component.html',
  styleUrls: ['./auth-route.component.css']
})
export class AuthRouteComponent implements OnInit {

  constructor(private router: Router, private auth: AuthService) { }

  async ngOnInit(): Promise<void> {
    if (!await this.auth.getUser()) {
      this.router.navigate(['login']);
    }
  }

}
