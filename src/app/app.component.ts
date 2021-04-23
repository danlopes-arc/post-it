import {Component, OnInit} from '@angular/core';
import {User} from './models/User';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'post-it';
  user: User | null = null;

  constructor() {
  }

  ngOnInit(): void {
  }
}
