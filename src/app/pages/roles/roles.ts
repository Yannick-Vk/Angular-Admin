import {Component, computed, inject, signal, WritableSignal} from '@angular/core';
import {AddRole} from './add-role/add-role';
import {Router} from '@angular/router';
import {RoleService} from '../../services/role-service';
import {Role, RoleDto, UserWithRoleDto} from '../../models/Role';
import {Table} from '../../components/table/table';
import {AddRoleToUser} from './add-role-to-user/add-role-to-user';

@Component({
  selector: 'roles',
  imports: [
    AddRole,
    Table,
    AddRoleToUser
  ],
  templateUrl: './roles.html',
  styleUrl: './roles.css'
})
export class Roles {
  roleService = inject(RoleService);
  router = inject(Router);
  roles: WritableSignal<Array<Role>> = signal([]);
  roleNames = computed(() => this.roles().map(role => role.name));

  constructor() {
    this.getRoles();
  }

  getRoles() {
    this.roleService.GetRoles().subscribe({
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

  addRoleToUser(data: {RoleName: string, Username: string}) {
    const dto = new UserWithRoleDto(data.RoleName, data.Username);
    this.roleService.AddRoleToUser(dto).subscribe({
      next: () => {
        console.log(`Added role ${data.RoleName} to ${data.Username}`);
      },
      error: (err) => {
        console.error('Error adding role to user:', err);
      }
    });
  }

  showInfo(role: Role) {
    this.router.navigate([`/Roles/${role.name}`]).then(success => {
      if (success) {
        console.log('Successfully navigated');
      } else {
        console.log('Failed to navigate to role');
      }
    })
  }

}
