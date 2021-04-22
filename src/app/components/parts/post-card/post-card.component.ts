import {Component, Input, OnInit} from '@angular/core';
import {Post} from '../../../models/Post';
import {Router} from '@angular/router';
import {DatabaseService} from '../../../services/database.service';
import {User} from '../../../models/User';
import {getRelativeTime} from '../../../utils/relativeTime';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.css']
})
export class PostCardComponent implements OnInit {

  getRelativeTime = getRelativeTime;
  user: User | null = null;

  @Input() post: Post | null = null;

  constructor(public router: Router,
              private database: DatabaseService) {
  }

  async ngOnInit(): Promise<void> {
    if (!this.post) {
      return;
    }
    this.user = await this.database.users.getPostUser(this.post);
  }

}
