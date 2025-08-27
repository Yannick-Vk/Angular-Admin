import {inject, Injectable} from '@angular/core';
import {AuthService} from './AuthService';
import {User} from '../models/Users';
import {HttpClient} from '@angular/common/http';

@Injectable({
  'providedIn': 'root'
})
export class UserService {
  authService: AuthService = inject(AuthService);
  private client = inject(HttpClient)
  private baseUrl = 'https://localhost:7134/api/v1/Users';

  public getUsers(): Array<User> {
    if (!this.authService.IsLoggedIn()) { return []; }

    return [];
  }
}
