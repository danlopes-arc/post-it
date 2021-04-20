import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TimelinePageComponent } from './components/pages/timeline-page/timeline-page.component';
import { LoginPageComponent } from './components/pages/login-page/login-page.component';
import { RegisterPageComponent } from './components/pages/register-page/register-page.component';
import {DatabaseService} from './services/database.service';
import { AuthRouteComponent } from './components/routes/auth-route/auth-route.component';
import { GuestRouteComponent } from './components/routes/guest-route/guest-route.component';
import {ReactiveFormsModule} from '@angular/forms';
import { CompassSvgComponent } from './components/svgs/compass-svg/compass-svg.component';
import { PostsSvgComponent } from './components/svgs/posts-svg/posts-svg.component';
import { PeopleSvgComponent } from './components/svgs/people-svg/people-svg.component';
import { AvatarSvgComponent } from './components/svgs/avatar-svg/avatar-svg.component';
import { ExplorePageComponent } from './components/pages/explore-page/explore-page.component';
import { FollowingPageComponent } from './components/pages/following-page/following-page.component';
import { HomePageComponent } from './components/pages/home-page/home-page.component';
import { MainLayoutComponent } from './components/layouts/main-layout/main-layout.component';

@NgModule({
  declarations: [
    AppComponent,
    TimelinePageComponent,
    LoginPageComponent,
    RegisterPageComponent,
    AuthRouteComponent,
    GuestRouteComponent,
    CompassSvgComponent,
    PostsSvgComponent,
    PeopleSvgComponent,
    AvatarSvgComponent,
    ExplorePageComponent,
    FollowingPageComponent,
    HomePageComponent,
    MainLayoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [DatabaseService],
  bootstrap: [AppComponent]
})
export class AppModule { }
