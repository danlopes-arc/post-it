import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {FormBuilder, Validators} from '@angular/forms';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

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
    private builder: FormBuilder
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

    if (await this.auth.login(this.form.get('username')?.value.toLowerCase() ?? '')) {
      await this.router.navigate(['timeline']);
      return;
    }

    this.form.get('username')?.setErrors({doesNotExist: true});
    this.isLoading = false;
  }

  shouldShowErrorsForControl(controlName: string): boolean {
    return !!this.form.get(controlName)?.errors && (this.isSubmitted || !!this.form.get(controlName)?.touched);
  }

  shouldDisableSubmit(): boolean {
    return this.form.invalid && (this.isSubmitted || this.form.touched);
  }
}
