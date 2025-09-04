import {inject, Injectable} from '@angular/core';
import {Role, RoleDto, UserWithRoleDto} from '../models/Role';
import {AuthService} from './AuthService';
import {HttpResponse} from '@angular/common/http';
import {catchError, Observable, of, tap} from 'rxjs';
import {HttpService} from './http-service';
import {User} from '../models/Users';

@Injectable({
  providedIn: 'root'
})
export class RoleService extends HttpService {
  override path = 'roles'

  public GetRoles() {
    return this.client.get<Array<Role>>(`${this.baseUrl()}`)
      .pipe(
        tap(data => {
          return data;
        }),
        catchError((error: HttpResponse<any>) => {
          console.error('Failed to get Roles: ', error);
          throw error;
        }));
  }

  public AddRole(role: RoleDto) {
    //console.log(`Adding role ${role} ...`);
    return this.client.post(`${this.baseUrl()}`, role)
      .pipe(
        catchError((error: HttpResponse<any>) => {
          console.error(`Failed to add Role(${role}): `, error);
          throw error
        }));
  }

  public DeleteRole(role: RoleDto) {
    //console.log(`Deleting role ${role.roleName} ...`);
    return this.client.delete(`${this.baseUrl()}`, {
      body: role
    })
      .pipe(
        catchError((error: HttpResponse<any>) => {
          console.error(`Failed to delete Role(${role}): `, error);
          throw error
        }));
  }

  public AddRoleToUser(dto: UserWithRoleDto) {
    //console.log(`Adding role ${dto.roleName} to user ${dto.username} ...`);
    return this.client.post(`${this.baseUrl()}/add-to-user`, dto)
      .pipe(
        catchError((error: HttpResponse<any>) => {
          console.error(`Failed to add role to user: `, error);
          throw error
        }));
  }

  public RemoveRoleFromUser(dto: UserWithRoleDto) {
    //console.log(`Removing role ${dto.roleName} from user ${dto.username} ...`);
    return this.client.post(`${this.baseUrl()}/remove-from-user`, dto)
      .pipe(
        catchError((error: HttpResponse<any>) => {
          console.error(`Failed to remove role from user: `, error);
          throw error
        }));
  }

  public GetUsersWithRole(roleName: string): Observable<Array<User>> {
    //console.log(`Getting users with roleName ${roleName}`);
    return this.client.get<Array<User>>(`${this.baseUrl()}/${roleName}`).pipe(
      catchError((error: HttpResponse<any>) => {
        console.error('Failed to get Users: ', error);
        throw error;
      })
    )
  }

  public UserHasRole(dto: UserWithRoleDto) {
    //console.log(`Checking if ${dto.username} has role ${dto.roleName}`);
    return this.client.get<Array<User>>(`${this.baseUrl()}/${dto.roleName}/${dto.username}`).pipe(
      catchError((error: HttpResponse<any>) => {
        console.error('Failed to get data: ', error);
        throw error;
      })
    )
  }
}
