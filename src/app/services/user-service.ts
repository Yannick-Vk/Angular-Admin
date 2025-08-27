import {inject, Injectable} from '@angular/core';
import {AuthService} from './AuthService';
import {User} from '../models/Users';

@Injectable({
  'providedIn': 'root'
})
export class UserService {
  authService: AuthService = inject(AuthService);

  public getUsers(): Array<User> {
    if (!this.authService.IsLoggedIn()) { return []; }

    return [];
  }
}
