import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TimelinePageComponent} from './components/pages/timeline-page/timeline-page.component';
import {LoginPageComponent} from './components/pages/login-page/login-page.component';
import {RegisterPageComponent} from './components/pages/register-page/register-page.component';
import {ExplorePageComponent} from './components/pages/explore-page/explore-page.component';
import {FollowingPageComponent} from './components/pages/following-page/following-page.component';
import {HomePageComponent} from './components/pages/home-page/home-page.component';
import {AboutPageComponent} from './components/pages/about-page/about-page.component';
import {ProfilePageComponent} from './components/pages/profile-page/profile-page.component';
import {EditProfilePageComponent} from './components/pages/edit-profile-page/edit-profile-page.component';
import {NewPostPageComponent} from './components/pages/new-post-page/new-post-page.component';
import {EditPostPageComponent} from './components/pages/edit-post-page/edit-post-page.component';
import {ViewPostPageComponent} from './components/pages/view-post-page/view-post-page.component';
import {NewCommentPageComponent} from './components/pages/new-comment-page/new-comment-page.component';
import {EditCommentPageComponent} from './components/pages/edit-comment-page/edit-comment-page.component';
import {SettingsPageComponent} from './components/pages/settings-page/settings-page.component';

const routes: Routes = [
  {path: '', component: HomePageComponent},
  {path: 'login', component: LoginPageComponent},
  {path: 'register', component: RegisterPageComponent},
  {path: 'explore', component: ExplorePageComponent},
  {path: 'following', component: FollowingPageComponent},
  {path: 'timeline', component: TimelinePageComponent},
  {path: 'about', component: AboutPageComponent},
  {path: 'settings', component: SettingsPageComponent},
  {path: 'profile', component: ProfilePageComponent},
  {path: 'profile/edit', component: EditProfilePageComponent},
  {path: 'users/:id', component: ProfilePageComponent},
  {path: 'posts/new', component: NewPostPageComponent},
  {path: 'posts/:id', component: ViewPostPageComponent},
  {path: 'posts/:id/edit', component: EditPostPageComponent},
  {path: 'posts/:postId/comments/new', component: NewCommentPageComponent},
  {path: 'comments/:id/edit', component: EditCommentPageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
