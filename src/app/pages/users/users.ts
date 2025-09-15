import {Component, inject, signal, WritableSignal} from '@angular/core';
import {UserService} from '../../services/user-service';
import {User} from '../../models/Users';
import {CommonModule} from "@angular/common";
import {Router} from '@angular/router';
import {Table} from '../../components/table/table';

@Component({
    selector: 'app-users',
    imports: [CommonModule, Table],
    templateUrl: './users.html',
})
export class Users {
    userService = inject(UserService);
    router = inject(Router);
    users: WritableSignal<Array<User>> = signal([]);

    constructor() {
        this.getUsers();
    }

    getUsers() {
        this.userService.getUsers().subscribe({
            next: (users) => {
                this.users.set(users);
            },
            error: (err) => {
                console.error('Error getting users:', err);
            }
        });
    }

    viewDetails(userName: string) {
        this.router.navigate(['Users', userName]).then();
    }

}
