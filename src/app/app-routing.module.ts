import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TimelinePageComponent} from './components/pages/timeline-page/timeline-page.component';
import {LoginPageComponent} from './components/pages/login-page/login-page.component';
import {RegisterPageComponent} from './components/pages/register-page/register-page.component';

const routes: Routes = [
  {path: '', component: TimelinePageComponent},
  {path: 'login', component: LoginPageComponent},
  {path: 'register', component: RegisterPageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
