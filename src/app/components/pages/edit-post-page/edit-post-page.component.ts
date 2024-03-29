import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {DatabaseService} from '../../../services/database.service';
import {Location} from '@angular/common';
import {Post} from '../../../models/Post';
import {getCoordinatesAddress, getCurrentLocation} from '../../../utils/geolocation';

@Component({
  selector: 'app-edit-post-page',
  templateUrl: './edit-post-page.component.html',
  styleUrls: ['./edit-post-page.component.css']
})
export class EditPostPageComponent implements OnInit {

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
  post: Post | null = null;
  isLoading = false;
  isSubmitted = false;
  shouldDhowDeleteConfirmation = false;

  address: string | null = null;
  latitude: number | null = null;
  longitude: number | null = null;

  constructor(public router: Router,
              private auth: AuthService,
              private builder: FormBuilder,
              private database: DatabaseService,
              public location: Location,
              private activatedRoute: ActivatedRoute) {
  }

  async ngOnInit(): Promise<void> {
    const id = this.activatedRoute.snapshot.params.id;
    if (!id) {
      await this.router.navigate(['timeline']);
      return;
    }
    const authUser = await this.auth.getUser();
    this.post = await this.database.posts.findById(id);
    if (!this.post || this.post.userId !== authUser?.id) {
      await this.router.navigate(['timeline']);
      return;
    }

    this.form.get('title')?.setValue(this.post.title);
    this.form.get('body')?.setValue(this.post.body);

    this.form.get('title')?.markAsTouched();
    this.form.get('body')?.markAsTouched();

    this.latitude = this.post.latitude;
    this.longitude = this.post.longitude;

    if (this.post.hasCoordinates()) {
      this.form.get('saveLocation')?.setValue(true);
      this.address = await getCoordinatesAddress(this.latitude || 0, this.longitude || 0);
    }
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

    if (!this.post) {
      return;
    }

    this.post.title = this.form.get('title')?.value || '';
    this.post.body = this.form.get('body')?.value || '';
    if (this.address) {
      this.post.latitude = this.latitude;
      this.post.longitude = this.longitude;
    } else {
      this.post.latitude = null;
      this.post.longitude = null;
    }

    await this.database.posts.update(this.post);
    await this.router.navigate(['posts', this.post?.id]);


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

  onDeleteConfirm = async (): Promise<void> => {
    if (!this.post) {
      return;
    }
    await this.database.posts.delete(this.post);
    await this.router.navigate(['timeline']);
  }

  onDeleteCancel = (): void => {
    this.shouldDhowDeleteConfirmation = false;
  }

  async onSaveLocationSelected(): Promise<void> {
    if (!this.form.get('saveLocation')?.value) {
      const resp = await getCurrentLocation();
      if (!resp.location) {
        this.form.get('saveLocation')?.setValue(false);
      } else {
        this.latitude = resp.location.coords.latitude;
        this.longitude = resp.location.coords.longitude;
        this.address = await getCoordinatesAddress(this.latitude || 0, this.longitude || 0);
        return;
      }
    }
    this.latitude = null;
    this.longitude = null;
    this.address = null;
  }
}
