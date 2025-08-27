import {Routes} from '@angular/router';
import {LoginForm} from './pages/login/LoginForm';
import {RegisterForm} from './pages/register/register';

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
  },
];
