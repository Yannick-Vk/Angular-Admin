import {Routes} from '@angular/router';
import {LoginForm} from './pages/login/LoginForm';
import {RegisterForm} from './pages/register/register';
import {Users} from './pages/users/users';

export const routes: Routes = [
  {
    'path': '',
    'pathMatch': 'full',
    'component': LoginForm
  }, {
    'path': 'Login',
    'component': LoginForm
  }, {
    'path': 'Register',
    'component': RegisterForm
  }, {
    'path': 'Users',
    'component': Users
  },
];
