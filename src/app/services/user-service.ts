import {inject, Injectable} from '@angular/core';
import {AuthService} from './AuthService';
import {User} from '../models/Users';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {catchError, of, tap} from 'rxjs';
import {HttpService} from './http-service';

@Injectable({
  'providedIn': 'root'
})
export class UserService extends HttpService {
  authService: AuthService = inject(AuthService);
  override path = 'users'

  public getUsers() {
    if (!this.authService.IsLoggedIn()) {
      console.error('Users not logged in');
      return of([]);
    }

    return this.client.get<Array<User>>(`${this.baseUrl()}`)
      .pipe(
        tap(authResult => {
          console.table(authResult);
          return authResult;
        }),
        catchError((error: HttpResponse<any>) => {
          console.error('Failed to get users: ', error);
          throw error;
        }));
  }
}

