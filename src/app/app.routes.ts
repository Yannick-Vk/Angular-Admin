import {Routes} from '@angular/router';
import {LoginForm} from './login/LoginForm';

export const routes: Routes = [
  {
    'path': '',
    'pathMatch': 'full',
    'component': LoginForm
  },
];
