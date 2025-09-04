import {ChangeDetectionStrategy, Component, computed, inject, signal, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../../services/user-service';
import {User} from '../../../models/Users';
import {Table} from '../../../components/table/table';
import {RoleService} from '../../../services/role-service';
import {RoleDto, UserWithRoleDto} from '../../../models/Role';
import {Form} from '../../../components/forms/form/form';
import {Modal} from "../../../components/modal/modal";

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [
    Table,
    Form,
    Modal
  ],
  templateUrl: './user-info.html',
  styleUrl: './user-info.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserInfo {
  router = inject(Router)
  userService = inject(UserService);
  roleService = inject(RoleService);
  private route = inject(ActivatedRoute);

  user = signal<User>({email: '', id: '', username: ''});
  roles = signal<Array<string>>([])
  allRoles = signal<Array<string>>([]);
  remainingRoles = computed(() => this.allRoles().filter(role => !this.roles().includes(role)));
  options = computed(() => {
    const roles = this.remainingRoles();
    if (roles.length === 0) {
      return [{ value: '', label: 'No more roles', disabled: true }];
    }
    return roles.map(role => ({ value: role, label: role }));
  });
  isFormValidAdd = signal(false);
  isFormValidCreate = signal(false);
  roleToRemove = signal<{roleName: string, username: string} | null>(null);

  @ViewChild('confirmRemoveRoleModal') confirmRemoveRoleModal!: Modal;

  constructor() {
    const userName = this.route.snapshot.paramMap.get('userName');
    if (!userName) {
      this.router.navigate(['/Users']).then();
      return;
    }

    this.getUser(userName)
    this.getRoles(userName);
    this.getAllRoles();
  }

  onFormValidityChangeAdd(isValid: boolean) {
    this.isFormValidAdd.set(isValid);
  }

  onFormValidityChangeCreate(isValid: boolean) {
    this.isFormValidCreate.set(isValid);
  }

  private getUser(userName: string) {
    this.userService.getUser(userName).subscribe({
      next: (user) => {
        this.user.set(user);
      },
      error: (err) => {
        console.error('Error getting users:', err);
      }
    });
  }

  private getRoles(username: string) {
    this.userService.getRoles(username).subscribe({
      next: (roles) => {
        this.roles.set(roles);
      },
      error: (err) => {
        console.error('Error getting roles:', err);
      }
    });
  }

  back() {
    this.router.navigate(['/Users']).then();
  }

  removeRole(roleName: string, username: string) {
    this.roleToRemove.set({roleName, username});
    this.confirmRemoveRoleModal.title.set('Remove Role');
    this.confirmRemoveRoleModal.message.set(`Are you sure you want to remove role ${roleName} from ${username}?`);
    this.confirmRemoveRoleModal.open();
  }

  addRole(formValue: { RoleName: string }) {
    const dto = { RoleName: formValue.RoleName, Username: this.user().username };
    this.roleService.AddRoleToUser(new UserWithRoleDto(dto.RoleName, dto.Username)).subscribe({
      next: () => {
        this.getRoles(this.user().username);
      },
      error: (err) => {
        console.error('Error adding role to user:', err);
      }
    });
  }

  getAllRoles() {
    this.roleService.GetRoles().subscribe({
      next: (roles) => {
        this.allRoles.set(roles.map(r => r.name));
      },
      error: (err) => {
        console.error('Error getting all roles:', err);
      }
    });
  }

  createNewRole(formValue: { RoleName: string, Username: string }) {
    const roleName = formValue.RoleName;
    const username = this.user().username;

    this.roleService.AddRole(new RoleDto(roleName))
    .subscribe({
      next: () => {
        this.roleService.AddRoleToUser(new UserWithRoleDto(roleName, username)).subscribe({
          next: () => {
            this.getAllRoles();
            this.getRoles(this.user().username);
          },
          error: (err) => {
            console.error('Error adding role to user:', err);
          }
        })
      },
      error: (err) => {
        console.error('Error creating role:', err);
      }
    })
  }

  confirmRemoveRole() {
    const toRemove = this.roleToRemove();
    if (toRemove) {
      this.roleService.RemoveRoleFromUser(new UserWithRoleDto(toRemove.roleName, toRemove.username)).subscribe(
        {
          next: (_) => {
            this.getRoles(toRemove.username);
            this.confirmRemoveRoleModal.close();
            this.roleToRemove.set(null);
          },
          error: (err) => {
            console.error('Error getting users:', err);
            this.confirmRemoveRoleModal.close();
            this.roleToRemove.set(null);
          }
        }
      );
    }
  }

  cancelRemoveRole() {
    this.confirmRemoveRoleModal.close();
    this.roleToRemove.set(null);
  }
}

