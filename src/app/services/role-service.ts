import {inject, Injectable} from '@angular/core';
import {Role, RoleDto} from '../models/Role';
import {AuthService} from './AuthService';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {catchError, of, tap} from 'rxjs';
import {api_base_url} from './Api';
import {HttpService} from './http-service';

@Injectable({
  providedIn: 'root'
})
export class RoleService extends HttpService {
  authService: AuthService = inject(AuthService);
  override path = 'roles'

  public getRoles() {
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
        tap(result => {
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
        tap(result => {
          console.log(`Role ${role.roleName} was deleted`);
        }),
        catchError((error: HttpResponse<any>) => {
          console.error(`Failed to delete Role(${role}): `, error);
          throw error
        }));
  }
}
