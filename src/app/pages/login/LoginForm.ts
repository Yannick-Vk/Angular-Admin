import {Component, inject, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';

import {AuthService} from '../../services/AuthService';
import {LoginRequest, LoginResponse} from '../../models/Auth';
import {Form} from '../../components/forms/form/form';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'login-form',
  imports: [
    ReactiveFormsModule,
    Form
  ],
  templateUrl: './LoginForm.html',
  styleUrl: './LoginForm.scss',
})
export class LoginForm {
  @ViewChild(Form) formComponent!: Form;
  private client = inject(AuthService);
  private router = inject(Router);
  public errorMessage: string | undefined;

  onSubmit(form: { Username: string, Password: string }): void {
    const user: LoginRequest = {UserName: form.Username, password: form.Password}

    this.client.Login(user).subscribe({
      next: () => this.router.navigate(['/']).then(),
      error: (err: HttpErrorResponse) => this.errorMessage = err.error.message,
    });
  }

  redirect() {
    this.router.navigate(['/Register']).then();
  }

  isValid(): boolean {
    return this.formComponent?.isValid();
  }
}
