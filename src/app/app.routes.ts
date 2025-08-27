import {Routes} from '@angular/router';
import {LoginForm} from './login/LoginForm';
import {RegisterForm} from './register/register';

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
