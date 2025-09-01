import {Component, inject, signal} from '@angular/core';
import {RouterLink} from '@angular/router';
import {AuthService} from '../services/AuthService';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {
  private authService = inject(AuthService);
  loggedIn = signal(this.authService.IsLoggedIn());

  constructor() {
    this.authService.isLoggedIn$.subscribe(loggedIn => {
      this.loggedIn.set(loggedIn);
    });
  }
}
