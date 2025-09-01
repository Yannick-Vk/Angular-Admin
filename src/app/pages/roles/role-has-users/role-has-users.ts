import {Component, inject, signal, WritableSignal} from '@angular/core';
import {RoleService} from '../../../services/role-service';
import {Router} from '@angular/router';
import {User} from '../../../models/Users';
import {UserService} from '../../../services/user-service';

@Component({
  selector: 'app-role-has-users',
  imports: [],
  templateUrl: './role-has-users.html',
  styleUrl: './role-has-users.css'
})
export class RoleHasUsers {
  roleService = inject(RoleService);
  router = inject(Router);
  users: WritableSignal<Array<User>> = signal([]);


  constructor() {
    this.getUsers("Admin");
  }

  getUsers(roleName: string) {
    this.roleService.GetUsersWithRole(roleName).subscribe({
      next: (users) => {
        console.table(users);
        this.users.set(users);
      },
      error: (err) => {
        console.error('Error getting users:', err);
      }
    })
  }
}
