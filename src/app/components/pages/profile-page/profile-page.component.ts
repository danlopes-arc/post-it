import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DatabaseService} from '../../../services/database.service';
import {AuthService} from '../../../services/auth.service';
import {User} from '../../../models/User';
import {Post} from '../../../models/Post';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {

  user: User | null = null;
  authUser: User | null = null;
  isFollowing = false;
  isAuthUser = false;
  posts: Post[] = [];

  constructor(public router: Router,
              private database: DatabaseService,
              private auth: AuthService,
              private activatedRoute: ActivatedRoute) {
  }

  async ngOnInit(): Promise<void> {
    await this.loadUser();
    await this.loadPosts();
  }
  private async loadPosts(): Promise<void> {
    if (!this.user) {
      return;
    }
    this.posts = await this.database.posts.getUserPosts(this.user);
    this.posts.sort((p1, p2) => +p2.createdAt - +p1.createdAt);
  }

  private async loadUser(): Promise<void> {
    const authUser = await this.auth.getUser();
    this.authUser = authUser;
    if (!authUser) {
      this.router.navigate(['']);
      return;
    }
    if (this.activatedRoute.snapshot.routeConfig?.path === 'profile') {
      this.user = authUser;
      this.isAuthUser = true;
      return;
    }
    this.user = await this.database.users.findById(this.activatedRoute.snapshot.params.id);
    if (!this.user) {
      this.router.navigate(['']);
      return;
    }
    if (this.user.id === authUser.id) {
      this.isAuthUser = true;
      return;
    }
    const followers = await this.database.users.getFollowers(this.user);
    if (followers.find(user => user.id === authUser.id)) {
      this.isFollowing = true;
    }
  }

  onFollow = async (): Promise<void> => {
    if (!this.authUser || !this.user) {
      return;
    }
    await this.database.users.addFollower(this.authUser, this.user);
    this.isFollowing = true;
  }

  onUnfollow = async (): Promise<void> => {
    if (!this.authUser || !this.user) {
      return;
    }
    await this.database.users.removeFollower(this.authUser, this.user);
    this.isFollowing = false;
  }

  onEdit = async (): Promise<void> => {
    console.log('edit');
  }

  async onLogout(): Promise<void> {
    await this.auth.logout();
    await this.router.navigate(['']);
  }

}
