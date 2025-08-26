import {Component, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'login-form',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './LoginForm.html',
  styleUrl: './LoginForm.scss',
})
export class LoginForm {
  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  })

  onSubmit() {
    console.log(this.loginForm.value);
  }
}
