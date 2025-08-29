import {inject, Injectable} from '@angular/core';
import {Role} from '../models/Role';
import {AuthService} from './AuthService';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {catchError, of, tap} from 'rxjs';
import {User} from '../models/Users';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  authService: AuthService = inject(AuthService);
  private client = inject(HttpClient)
  private baseUrl = 'https://localhost:7134/api/v1/Roles';

  public getRoles() {
    if (!this.authService.IsLoggedIn()) {
      console.error('Users not logged in');
      return of([]);
    }

    return this.client.get<Array<Role>>(`${this.baseUrl}`)
      .pipe(
        tap(data => {
          console.table(data);
          return data;
        }),
        catchError((error: HttpResponse<any>) => {
          console.error('Failed to get Roles: ', error);
          throw error;
        }));
  }
}
