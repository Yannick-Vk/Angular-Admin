import {Routes} from '@angular/router';
import {LoginForm} from './pages/login/LoginForm';
import {RegisterForm} from './pages/register/register';
import {Users} from './pages/users/users';
import {HomeComponent} from './pages/home/home';
import {authGuard} from './guards/auth-guard';
import {Roles} from './pages/roles/roles';

export const routes: Routes = [
  {
    'path': '',
    'pathMatch': 'full',
    'component': HomeComponent,
  }, {
    'path': 'Login',
    'component': LoginForm,
  }, {
    'path': 'Register',
    'component': RegisterForm,
  }, {
    'path': 'Users',
    'component': Users,
    'canActivate': [authGuard],
  }, {
    'path': 'Roles',
    'component': Roles,
    'canActivate': [authGuard],
  }
];
