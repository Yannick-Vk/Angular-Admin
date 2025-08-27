import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../services/AuthService';
import {LoginRequest} from '../../models/Auth';
import {Router} from '@angular/router';

@Component({
  selector: 'login-form',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './LoginForm.html',
  styleUrl: './LoginForm.scss',
})
export class LoginForm {
  private client = inject(AuthService);
  private router = inject(Router);

  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  })

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    const form = this.loginForm.value;
    // Mark as not null since the form is validated
    const user: LoginRequest = {UserName: form.username!, password: form.password!}
    this.client.Login(user).subscribe(() => {
      this.router.navigate(['/']).then(r => console.log('Redirecting ...', r));
    });
  }

  redirect() {
    this.router.navigate(['/Register']).then(r => console.log('Redirecting ...', r));
  }
}
