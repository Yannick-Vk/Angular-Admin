import {Component, inject, signal, WritableSignal} from '@angular/core';
import {AddRole} from './add-role/add-role';
import {Router} from '@angular/router';
import {RoleService} from '../../services/role-service';
import {Role, RoleDto} from '../../models/Role';
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

  constructor() {
    this.getRoles();
  }

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

  addRole(roleName: string) {
    this.roleService.AddRole(new RoleDto(roleName)).subscribe({
      next: () => {
        this.getRoles();
      },
      error: (err) => {
        console.error('Error adding role:', err);
      }
    });
  }

  deleteRole(roleName: string) {
    this.roleService.DeleteRole(new RoleDto(roleName)).subscribe({
      next: () => {
        this.getRoles();
      },
      error: (err) => {
        console.error('Error deleting role:', err);
      }
    })
  }
}
