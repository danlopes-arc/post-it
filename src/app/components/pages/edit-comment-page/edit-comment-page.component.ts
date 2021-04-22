import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {Post} from '../../../models/Post';
import {Comment} from '../../../models/Comment';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {DatabaseService} from '../../../services/database.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-edit-comment-page',
  templateUrl: './edit-comment-page.component.html',
  styleUrls: ['./edit-comment-page.component.css']
})
export class EditCommentPageComponent implements OnInit {


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
  comment: Comment | null = null;
  shouldDhowDeleteConfirmation = false;

  constructor(
    public router: Router,
    private auth: AuthService,
    private builder: FormBuilder,
    private database: DatabaseService,
    public location: Location,
    private activatedRoute: ActivatedRoute) {
  }


  async ngOnInit(): Promise<void> {
    const {id} = this.activatedRoute.snapshot.params;
    if (!id) {
      await this.router.navigate(['timeline']);
      return;
    }

    const authUser = await this.auth.getUser();
    this.comment = await this.database.comments.findById(id);
    if (!this.comment || this.comment.userId !== authUser?.id) {
      await this.router.navigate(['timeline']);
      return;
    }

    this.post = await this.database.posts.findById(this.comment?.postId);
    if (!this.post) {
      await this.router.navigate(['timeline']);
      return;
    }

    this.form.get('body')?.setValue(this.comment.body);
    this.form.get('body')?.markAsTouched();
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

    if (!this.comment) {
      this.router.navigate(['']);
      return;
    }

    this.comment.body = this.form.get('body')?.value || '';
    await this.database.comments.update(this.comment);
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
    if (!this.comment) {
      return;
    }
    await this.database.comments.delete(this.comment);
    await this.router.navigate(['posts', this.comment.postId]);
  }

  onDeleteCancel = (): void => {
    this.shouldDhowDeleteConfirmation = false;
  }
}
