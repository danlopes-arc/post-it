import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {DatabaseService} from '../../../services/database.service';
import {Location} from '@angular/common';
import {Post} from '../../../models/Post';
import {Comment} from '../../../models/Comment';

@Component({
  selector: 'app-new-comment-page',
  templateUrl: './new-comment-page.component.html',
  styleUrls: ['./new-comment-page.component.css']
})
export class NewCommentPageComponent implements OnInit {

  form = this.builder.group({
    body: ['', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(300)
    ]],
  });

  isLoading = false;
  isSubmitted = false;
  post: Post | null = null;

  constructor(
    public router: Router,
    private auth: AuthService,
    private builder: FormBuilder,
    private database: DatabaseService,
    public location: Location,
    private activatedRoute: ActivatedRoute) {
  }

  async ngOnInit(): Promise<void> {
    const {postId} = this.activatedRoute.snapshot.params;
    if (!postId) {
      await this.router.navigate(['timeline']);
      return;
    }
    this.post = await this.database.posts.findById(postId);
    if (!this.post) {
      await this.router.navigate(['timeline']);
      return;
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

    const user = await this.auth.getUser();
    if (!user) {
      this.router.navigate(['']);
      return;
    }

    const comment = new Comment();
    comment.userId = user.id;
    comment.postId = this.post?.id || 0;
    comment.body = this.form.get('body')?.value || '';
    await this.database.comments.create(comment);
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
}
