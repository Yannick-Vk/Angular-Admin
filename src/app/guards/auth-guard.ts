import { CanActivateFn } from '@angular/router';
import {AuthService} from '../services/AuthService';
import {inject} from '@angular/core';

/// Only loggedIn users can acces this page
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);  return authService.IsLoggedIn();
};
