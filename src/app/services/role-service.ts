import {inject, Injectable} from '@angular/core';
import {Role, RoleDto} from '../models/Role';
import {AuthService} from './AuthService';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {catchError, of, tap} from 'rxjs';
import {api_base_url} from './Api';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  authService: AuthService = inject(AuthService);
  private client = inject(HttpClient)
  private baseUrl = `${api_base_url}/Roles`;

  public getRoles() {
    if (!this.authService.IsLoggedIn()) {
      console.error('Users not logged in');
      return of([]);
    }
    return this.client.get<Array<Role>>(`${this.baseUrl}`)
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
    return this.client.post(`${this.baseUrl}`, role)
      .pipe(
        tap(result => {
          console.table(result);
        }),
        catchError((error: HttpResponse<any>) => {
          console.error(`Failed to add Role(${role}): `, error);
          throw error
        }));
  }
}
