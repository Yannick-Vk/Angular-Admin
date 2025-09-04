import {Component, inject, signal} from '@angular/core';
import {RouterLink} from '@angular/router';
import {AuthService} from '../services/AuthService';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {
  private authService = inject(AuthService);
  loggedIn = signal(this.authService.IsLoggedIn());
  isHamburgerMenuOpen = signal(false)

  constructor() {
    this.authService.isLoggedIn$.subscribe(loggedIn => {
      this.loggedIn.set(loggedIn);
    });
  }

  toggleHamburgerMenu() {
    this.isHamburgerMenuOpen.set(!this.isHamburgerMenuOpen());
  }
}
