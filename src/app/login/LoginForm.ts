import {Component, signal} from '@angular/core';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'login-form',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './loginForm.html',
  styleUrl: './Form.css'
})
export class LoginForm {
  username = new FormControl('');
  password = new FormControl('');
}
