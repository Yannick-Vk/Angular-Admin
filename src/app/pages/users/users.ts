import {Component, inject, signal, WritableSignal} from '@angular/core';
import {UserService} from '../../services/user-service';
import {User} from '../../models/Users';
import {CommonModule} from "@angular/common";
import {Router} from '@angular/router';

@Component({
  selector: 'app-users',
  imports: [CommonModule],
  templateUrl: './users.html',
  styleUrl: './users.scss'
})
export class Users {
  userService = inject(UserService);
  router = inject(Router);
  users: WritableSignal<Array<User>> = signal([]);

  constructor() {
    this.getUsers();
  }

  getUsers() {
    if(!this.userService.authService.IsLoggedIn()) {
      //this.router.navigate(['/Login']).then(r => console.log(`User was not loggedIn`));
    }
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users.set(users);
      },
      error: (err) => {
        console.error('Error getting users:', err);
      }
    });
  }
}
