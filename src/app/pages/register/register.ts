import {Component, inject, ViewChild} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {AuthService} from '../../services/AuthService';
import {RegisterRequest} from '../../models/Auth';
import {Router} from '@angular/router';
import {Form} from '../../components/forms/form/form';

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

  onSubmit(form: {Username: string, Email: string, Password: string}): void {
    const user: RegisterRequest = {UserName: form.Username, password: form.Password, email: form.Email};

    this.client.Register(user).subscribe(() => {
      this.router.navigate(['/']).then();
    });
  }

  redirect() {
    this.router.navigate(['/Login']).then();
  }

  isValid(): boolean {
    return this.formComponent?.isValid();
  }
}
