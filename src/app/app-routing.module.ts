import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TimelinePageComponent} from './components/pages/timeline-page/timeline-page.component';
import {LoginPageComponent} from './components/pages/login-page/login-page.component';
import {RegisterPageComponent} from './components/pages/register-page/register-page.component';
import {ExplorePageComponent} from './components/pages/explore-page/explore-page.component';
import {FollowingPageComponent} from './components/pages/following-page/following-page.component';

const routes: Routes = [
  {path: '', component: TimelinePageComponent},
  {path: 'login', component: LoginPageComponent},
  {path: 'register', component: RegisterPageComponent},
  {path: 'explore', component: ExplorePageComponent},
  {path: 'following', component: FollowingPageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
