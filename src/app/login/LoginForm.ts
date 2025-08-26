import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../services/AuthService';

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

  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  })

  onSubmit() {
    console.log(this.loginForm.value)
    const form = this.loginForm.value;
    this.client.Login({username: form.username!, password: form.password!});
  }
}
