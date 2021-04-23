import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {DatabaseService} from '../../../services/database.service';
import {Location} from '@angular/common';
import {Post} from '../../../models/Post';
import {getCoordinatesAddress, getCurrentLocation} from '../../../utils/geolocation';

@Component({
  selector: 'app-new-post-page',
  templateUrl: './new-post-page.component.html',
  styleUrls: ['./new-post-page.component.css']
})
export class NewPostPageComponent implements OnInit {

  form = this.builder.group({
    title: ['', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(60)
    ]],
    body: ['', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(300)
    ]],
    saveLocation: [false, []],
  });

  isLoading = false;
  isSubmitted = false;
  address: string | null = null;
  latitude = 0;
  longitude = 0;

  constructor(
    public router: Router,
    private auth: AuthService,
    private builder: FormBuilder,
    private database: DatabaseService,
    public location: Location) {
  }

  ngOnInit(): void {
  }

  getErrors(controlName: string): string[] {
    return Object.getOwnPropertyNames(this.form.get(controlName)?.errors ?? {});
  }

  async onSubmit(): Promise<void> {
    this.isSubmitted = true;
    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;

    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = await this.auth.getUser();
    if (!user) {
      this.router.navigate(['']);
      return;
    }

    let post = new Post();
    post.userId = user.id;
    post.title = this.form.get('title')?.value || '';
    post.body = this.form.get('body')?.value || '';
    if (this.address) {
      post.latitude = this.latitude;
      post.longitude = this.longitude;
    }

    post = await this.database.posts.create(post) ?? post;
    await this.router.navigate(['posts', post?.id]);


    this.isLoading = false;
  }

  shouldShowErrorsForControl(controlName: string): boolean {
    return !!this.form.get(controlName)?.errors && (this.isSubmitted || !!this.form.get(controlName)?.touched);
  }

  shouldDisableSubmit(): boolean {
    const keys = Object.getOwnPropertyNames(this.form.controls);
    let isShowingErrors = false;
    for (const key of keys) {
      const control = this.form.get(key);
      if (!control) {
        continue;
      }
      if (control.invalid && control.touched) {
        isShowingErrors = true;
        break;
      }
    }
    return this.form.invalid && (this.isSubmitted || isShowingErrors);
  }

  async onSaveLocationSelected(): Promise<void> {
    if (!this.form.get('saveLocation')?.value) {
      const resp = await getCurrentLocation();
      if (!resp.location) {
        this.form.get('saveLocation')?.setValue(false);
      } else {
        this.latitude = resp.location.coords.latitude;
        this.longitude = resp.location.coords.longitude;
        this.address = await getCoordinatesAddress(this.latitude, this.longitude);
        return;
      }
    }
    this.latitude = 0;
    this.longitude = 0;
    this.address = null;
  }
}
