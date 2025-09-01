import {inject, Injectable} from '@angular/core';
import {Role, RoleDto, AddRoleToUserDto} from '../models/Role';
import {AuthService} from './AuthService';
import {HttpResponse} from '@angular/common/http';
import {catchError, of, tap} from 'rxjs';
import {HttpService} from './http-service';
import {User} from '../models/Users';

@Injectable({
  providedIn: 'root'
})
export class RoleService extends HttpService {
  authService: AuthService = inject(AuthService);
  override path = 'roles'

  public GetRoles() {
    if (!this.authService.IsLoggedIn()) {
      console.error('Users not logged in');
      return of([]);
    }
    return this.client.get<Array<Role>>(`${this.baseUrl()}`)
      .pipe(
        tap(data => {
          if (data && data.length > 0) {
            console.table(data);
          }
          return data;
        }),
        catchError((error: HttpResponse<any>) => {
          console.error('Failed to get Roles: ', error);
          throw error;
        }));
  }

  public AddRole(role: RoleDto) {
    console.log(`Adding role ${role} ...`);
    return this.client.post(`${this.baseUrl()}`, role)
      .pipe(
        tap(() => {
          console.log(`Role ${role.roleName} added`);
        }),
        catchError((error: HttpResponse<any>) => {
          console.error(`Failed to add Role(${role}): `, error);
          throw error
        }));
  }

  public DeleteRole(role: RoleDto) {
    console.log(`Deleting role ${role.roleName} ...`);
    return this.client.delete(`${this.baseUrl()}`, {
      body: role
    })
      .pipe(
        tap(() => {
          console.log(`Role ${role.roleName} was deleted`);
        }),
        catchError((error: HttpResponse<any>) => {
          console.error(`Failed to delete Role(${role}): `, error);
          throw error
        }));
  }

  public AddRoleToUser(dto: AddRoleToUserDto) {
    console.log(`Adding role ${dto.roleName} to user ${dto.username} ...`);
    return this.client.post(`${this.baseUrl()}/add-to-user`, dto)
      .pipe(
        tap(() => {
          console.log(`Role ${dto.roleName} added to user ${dto.username}`);
        }),
        catchError((error: HttpResponse<any>) => {
          console.error(`Failed to add role to user: `, error);
          throw error
        }));
  }


  public GetUsersWithRole(roleName: string) {
    console.log(`Getting users with roleName ${roleName}`);
    return this.client.get<Array<User>>(`${this.baseUrl()}/${roleName}`).pipe(
      catchError((error: HttpResponse<any>) => {
        console.error('Failed to get Users: ', error);
        throw error;
      })
    )
  }
}
