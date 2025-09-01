import {Component, inject, ViewChild} from '@angular/core';
import {AbstractControl, ReactiveFormsModule, ValidationErrors, ValidatorFn} from '@angular/forms';
import {AuthService} from '../../services/AuthService';
import {RegisterRequest} from '../../models/Auth';
import {Router} from '@angular/router';
import {Form} from '../../components/forms/form/form';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'register-form',
  imports: [
    ReactiveFormsModule,
    Form
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class RegisterForm {
  @ViewChild(Form) formComponent!: Form;
  private client = inject(AuthService);
  private router = inject(Router);
  public errorMessage: string | undefined;

  passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('Password');
    const confirmPassword = control.get('ConfirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  };

  onSubmit(form: { Username: string, Email: string, Password: string, ConfirmPassword: string }): void {
    const user: RegisterRequest = {UserName: form.Username, password: form.Password, email: form.Email};

    if (this.formComponent.form.hasError('passwordMismatch')) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.client.Register(user).subscribe({
      next: () => this.router.navigate(['/']).then(),
      error: (err: HttpErrorResponse) => this.errorMessage = err.error.message,
    });
  }

  redirect() {
    this.router.navigate(['/Login']).then();
  }

  isValid(): boolean {
    return this.formComponent?.isValid();
  }
}
