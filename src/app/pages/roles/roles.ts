import {Component, inject, signal, WritableSignal} from '@angular/core';
import {AddRole} from './add-role/add-role';
import {Router} from '@angular/router';
import {RoleService} from '../../services/role-service';
import {Role} from '../../models/Role';
import {Table} from '../../components/table/table';

@Component({
  selector: 'roles',
  imports: [
    AddRole,
    Table
  ],
  templateUrl: './roles.html',
  styleUrl: './roles.css'
})
export class Roles {
  roleService = inject(RoleService);
  router = inject(Router);
  roles: WritableSignal<Array<Role>> = signal([]);

  getRoles() {
    this.roleService.getRoles().subscribe({
      next: (roles) => {
        this.roles.set(roles);
      },
      error: (err) => {
        console.error('Error getting roles:', err);
      }
    });
  }
}
