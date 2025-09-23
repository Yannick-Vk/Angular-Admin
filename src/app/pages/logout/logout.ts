import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../services/AuthService';

@Component({
    selector: 'app-logout',
    imports: [],
    template: ``,
})
export class Logout {
    router = inject(Router);
    auth = inject(AuthService)

    constructor() {
        this.auth.Logout().subscribe({
            // Navigate on success or error
            next: () => this.router.navigate(['/Login']),
            error: () => this.router.navigate(['/Login'])
        });
    }
}
