import {Component, inject, signal} from '@angular/core';
import {RouterLink} from '@angular/router';
import {AuthService} from '../services/AuthService';
import {CommonModule} from "@angular/common";
import {RoleService} from '../services/role-service';

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
  private roleService = inject(RoleService);
  loggedIn = signal(this.authService.IsLoggedIn());
  isAdmin = signal<boolean>(false);
  isHamburgerMenuOpen = signal(false)

  constructor() {
    this.authService.isLoggedIn$.subscribe(loggedIn => {
      this.loggedIn.set(loggedIn);
      if (loggedIn) {
        this.isAdminRole();
      } else {
        this.isAdmin.set(false);
      }
    });
  }

  toggleHamburgerMenu() {
    this.isHamburgerMenuOpen.set(!this.isHamburgerMenuOpen());
  }

  private isAdminRole() {
    const user = this.authService.getUser();
    if (!user) return;

    this.roleService.UserIsAdmin(user.username).subscribe(value => {
        this.isAdmin.set(value);
      }
    );
  }
}
