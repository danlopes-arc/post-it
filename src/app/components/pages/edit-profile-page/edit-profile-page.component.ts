import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {DatabaseService} from '../../../services/database.service';
import {User} from '../../../models/User';

@Component({
  selector: 'app-edit-profile-page',
  templateUrl: './edit-profile-page.component.html',
  styleUrls: ['./edit-profile-page.component.css']
})
export class EditProfilePageComponent implements OnInit {

  form = this.builder.group({
    username: ['', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(6)
    ]],
  });

  isLoading = false;
  isSubmitted = false;

  user: User | null = null;

  constructor(
    public router: Router,
    private auth: AuthService,
    private builder: FormBuilder,
    private database: DatabaseService) {
  }

  async ngOnInit(): Promise<void> {
    await this.loadUser();
  }

  private async loadUser(): Promise<void> {
    this.user = await this.auth.getUser();
    this.form.get('username')?.setValue(this.user?.username);
    this.form.get('username')?.markAsTouched();
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

    const username = this.form.get('username')?.value.toLowerCase() ?? '';

    if ((await this.database.users.find({username})).length) {
      this.form.get('username')?.setErrors({alreadyExists: true});
    } else {
      if (!this.user) {
        return;
      }
      this.user.username = username;
      await this.database.users.update(this.user);
      await this.auth.login(this.user.username);
      await this.router.navigate(['profile']);
    }

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
