import {Component, inject, signal} from '@angular/core';
import {NavigationEnd, Router, RouterLink} from '@angular/router';
import {AuthService} from '../services/AuthService';
import {CommonModule} from "@angular/common";
import {RoleService} from '../services/role-service';
import {filter} from 'rxjs';

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
    isAdmin = signal<boolean>(false);
    isHamburgerMenuOpen = signal(false)
    private authService = inject(AuthService);
    loggedIn = signal(this.authService.IsLoggedIn());
    private roleService = inject(RoleService);
    private router = inject(Router);

    constructor() {
        this.authService.isLoggedIn$.subscribe(loggedIn => {
            this.loggedIn.set(loggedIn);
            if (loggedIn) {
                this.isAdminRole();
            } else {
                this.isAdmin.set(false);
            }
        });

        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe(() => {
            this.isHamburgerMenuOpen.set(false);
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
