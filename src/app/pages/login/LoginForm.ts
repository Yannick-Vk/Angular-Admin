import {Component, inject, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {ReactiveFormsModule, ValidationErrors} from '@angular/forms';

import {AuthService} from '../../services/AuthService';
import {LoginRequest} from '../../models/Auth';
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
  public showValidationErrors: boolean = false;

  onSubmit(form: { Username: string, Password: string }): void {
    this.showValidationErrors = true;
    if (this.formComponent.form.invalid) {
      return;
    }

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

  onFormErrorsChanged(errors: ValidationErrors | null) {
  }
}
