import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, Validators} from '@angular/forms';
import {AuthService} from '../../../services/auth.service';
import {DatabaseService} from '../../../services/database.service';
import {User} from '../../../models/User';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit {

  form = this.builder.group({
    username: ['', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(6)
    ]],
  });

  isLoading = false;
  isSubmitted = false;

  constructor(
    public router: Router,
    private auth: AuthService,
    private builder: FormBuilder,
    private database: DatabaseService
  ) {
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

    const username = this.form.get('username')?.value.toLowerCase() ?? '';

    if ((await this.database.users.find({username})).length) {
      this.form.get('username')?.setErrors({alreadyExists: true});
    } else {
      const user = new User();
      user.username = username;
      await this.database.users.create(user);
      await this.auth.login(user.username);
      await this.router.navigate(['timeline']);
    }

    this.isLoading = false;
  }

  shouldShowErrorsForControl(controlName: string): boolean {
    return !!this.form.get(controlName)?.errors && (this.isSubmitted || !!this.form.get(controlName)?.touched);
  }

  shouldDisableSubmit(): boolean {
    return this.form.invalid && (this.isSubmitted || this.form.touched);
  }
}
