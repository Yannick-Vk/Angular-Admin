import {Component, inject, signal, WritableSignal} from '@angular/core';
import {RoleService} from '../../../services/role-service';
import {ActivatedRoute, Router} from '@angular/router';
import {User} from '../../../models/Users';
import {Table} from '../../../components/table/table';

@Component({
  selector: 'app-role-has-users',
  imports: [
    Table
  ],
  templateUrl: './role-has-users.html',
  styleUrl: './role-has-users.css'
})
export class RoleHasUsers {
  roleService = inject(RoleService);
  router = inject(Router);
  private route = inject(ActivatedRoute);

  users: WritableSignal<Array<User>> = signal([]);
  role: string | null;


  constructor() {
    this.role = this.route.snapshot.paramMap.get('roleName');
    if (!this.role) {return}

    this.getUsers(this.role);
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

  removeRole(userId: string) {

  }
}
