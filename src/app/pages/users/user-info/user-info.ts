import {Component, inject, signal, WritableSignal} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../../services/user-service';
import {User} from '../../../models/Users';
import {Users} from '../users';
import {Table} from '../../../components/table/table';
import {RoleService} from '../../../services/role-service';
import {UserWithRoleDto} from '../../../models/Role';
import {AddRoleToUser} from '../../roles/add-role-to-user/add-role-to-user';

@Component({
  selector: 'app-user-info',
  imports: [
    Table,
    AddRoleToUser
  ],
  templateUrl: './user-info.html',
  styleUrl: './user-info.css'
})
export class UserInfo {
  router = inject(Router)
  userService = inject(UserService);
  roleService = inject(RoleService);
  private route = inject(ActivatedRoute);

  user = signal<User>({email: '', id: '', username: ''});
  roles = signal<Array<string>>([])
  options = signal<Array<string>>([])

  constructor() {
    const userName = this.route.snapshot.paramMap.get('userName');
    if (!userName) {this.router.navigate(['/Users']).then(); return;}



    this.getUser(userName)
    this.getRoles(userName);
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

  addRole() {

  }

}
