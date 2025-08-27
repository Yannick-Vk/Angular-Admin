import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../services/AuthService';
import {RegisterRequest} from '../../models/Auth';
import {Router} from '@angular/router';

@Component({
  selector: 'register-form',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class RegisterForm {
  private client = inject(AuthService);
  private router = inject(Router);

  registerForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
  })

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }
    const form = this.registerForm.value;
    // Mark as not null since the form is validated
    const user: RegisterRequest = {UserName: form.username!, password: form.password!, email: form.email!,};
    this.client.Register(user).subscribe(() => {
      this.router.navigate(['/']).then(r => console.log('Redirecting ...', r));
    });
  }

  redirect() {
    this.router.navigate(['/Login']).then(r => console.log('Redirecting ...', r));
  }
}
