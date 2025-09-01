import {CanActivateFn} from '@angular/router';
import {AuthService} from '../services/AuthService';
import {inject} from '@angular/core';
import {RoleService} from '../services/role-service';

/// Only loggedIn users can acces this page
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  return authService.IsLoggedIn();
};

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  if (!authService.IsLoggedIn()) return false;

  const roleService = inject(RoleService);
  return true;
};
