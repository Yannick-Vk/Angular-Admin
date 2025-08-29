import {Component, inject, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';

import {AuthService} from '../../services/AuthService';
import {LoginRequest} from '../../models/Auth';
import {Form} from '../../components/forms/form/form';

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

  onSubmit(form: {Username: string, Password: string}): void {
    const user: LoginRequest = {UserName: form.Username, password: form.Password}

    this.client.Login(user).subscribe(() => {
      this.router.navigate(['/']).then(r => console.log('Redirecting ...', r));
    });
  }

  redirect() {
    this.router.navigate(['/Register']).then(r => console.log('Redirecting ...', r));
  }

  isValid(): boolean {
    return this.formComponent?.isValid();
  }
}
