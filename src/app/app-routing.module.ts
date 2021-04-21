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

const routes: Routes = [
  {path: '', component: HomePageComponent},
  {path: 'login', component: LoginPageComponent},
  {path: 'register', component: RegisterPageComponent},
  {path: 'explore', component: ExplorePageComponent},
  {path: 'following', component: FollowingPageComponent},
  {path: 'timeline', component: TimelinePageComponent},
  {path: 'about', component: AboutPageComponent},
  {path: 'profile', component: ProfilePageComponent},
  {path: 'profile/edit', component: EditProfilePageComponent},
  {path: 'users/:id', component: ProfilePageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
