import {HttpEvent, HttpHandlerFn, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthService} from './AuthService';
import {inject} from '@angular/core';

export function AuthInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<any>> {
  const token = inject(AuthService).GetToken();
  // If the token does not exist then skip the intercept
  if (!token) {
    return next(req);
  }

  //console.info('Auth token provided for', req.url);

  const cloned = req.clone({
    headers: req.headers.set('Authorization', 'Bearer ' + token)
  });

  return next(cloned);

}
