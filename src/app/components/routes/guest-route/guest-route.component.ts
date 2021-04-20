import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-guest-route',
  templateUrl: './guest-route.component.html',
  styleUrls: ['./guest-route.component.css']
})
export class GuestRouteComponent implements OnInit {

  constructor(private router: Router, private auth: AuthService) { }

  async ngOnInit(): Promise<void> {
    if (await this.auth.getUser()) {
      this.router.navigate(['timeline']);
    }
  }

}
