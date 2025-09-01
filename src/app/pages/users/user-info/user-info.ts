import {Component, computed, inject, signal, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../../services/user-service';
import {User} from '../../../models/Users';
import {Table} from '../../../components/table/table';
import {RoleService} from '../../../services/role-service';
import {UserWithRoleDto} from '../../../models/Role';
import {Form} from '../../../components/forms/form/form';

@Component({
  selector: 'app-user-info',
  imports: [
    Table,
    Form
  ],
  templateUrl: './user-info.html',
  styleUrl: './user-info.css'
})
export class UserInfo {
  @ViewChild(Form) formComponent!: Form;

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
  isFormValid = signal(false);

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

  onFormValidityChange(isValid: boolean) {
    this.isFormValid.set(isValid);
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
    this.roleService.RemoveRoleFromUser(new UserWithRoleDto(roleName, username)).subscribe(
      {
        next: (_) => {
          this.getRoles(username);
        },
        error: (err) => {
          console.error('Error getting users:', err);
        }
      }
    );
  }

  onSubmit() {
    const formValue = this.formComponent.form.getRawValue();
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
}

