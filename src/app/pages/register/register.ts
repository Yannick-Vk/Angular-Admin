import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../services/AuthService';
import {LoginRequest, RegisterRequest} from '../../models/Auth';
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
  private client = inject(AuthService);
  private router = inject(Router);

  onSubmit(form: {Username: string, Email: string, Password: string}): void {
    const user: RegisterRequest = {UserName: form.Username, password: form.Password, email: form.Email};

    this.client.Register(user).subscribe(() => {
      this.router.navigate(['/']).then(r => console.log('Redirecting ...', r));
    });
  }

  redirect() {
    this.router.navigate(['/Login']).then(r => console.log('Redirecting ...', r));
  }
}
