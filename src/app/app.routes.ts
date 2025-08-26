import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    'path': '',
    'pathMatch': 'full',
    'loadComponent': async () => {
      const module = await import('./login/LoginForm');
      return module.LoginForm;
    }
  }
];
