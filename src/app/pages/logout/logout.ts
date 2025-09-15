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
        this.auth.Logout();
        this.router.navigate(['/Login']).then(() => {
        });
    }
}
