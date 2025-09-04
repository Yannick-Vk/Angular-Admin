import {Component, inject, ViewChild} from '@angular/core';
import {AbstractControl, ReactiveFormsModule, ValidationErrors, ValidatorFn} from '@angular/forms';
import {AuthService} from '../../services/AuthService';
import {RegisterRequest} from '../../models/Auth';
import {Router, RouterLink} from '@angular/router';
import {Form} from '../../components/forms/form/form';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'register-form',
  imports: [
    ReactiveFormsModule,
    Form,
    RouterLink
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class RegisterForm {
  @ViewChild(Form) formComponent!: Form;
  private client = inject(AuthService);
  private router = inject(Router);
  public errorMessage: string | undefined;
  public showValidationErrors: boolean = false;

  passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('Password');
    const confirmPassword = control.get('ConfirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  };

  onSubmit(form: { Username: string, Email: string, Password: string, ConfirmPassword: string }): void {
    this.showValidationErrors = true;
    if (this.formComponent.form.invalid) {
      return;
    }

    const user: RegisterRequest = {UserName: form.Username, password: form.Password, email: form.Email};

    this.client.Register(user).subscribe({
      next: () => this.router.navigate(['/']).then(),
      error: (err: HttpErrorResponse) => {
        if (err.status === 0) {
          this.errorMessage = 'Could not connect to the server. Please try again later.';
        } else {
          this.errorMessage = err.error.message;
        }
      },
    });
  }



  isValid(): boolean {
    return this.formComponent?.isValid();
  }

  onFormErrorsChanged(errors: ValidationErrors | null) {
    if (errors?.['passwordMismatch']) {
      this.errorMessage = 'Passwords do not match.';
    } else if (this.formComponent.form.get('Email')?.errors?.['email']) {
      this.errorMessage = 'Invalid email format.';
    } else {
      this.errorMessage = undefined;
    }
  }
}
