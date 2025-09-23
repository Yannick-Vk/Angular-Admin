import {HttpEvent, HttpHandlerFn, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthService} from './AuthService';
import {inject} from '@angular/core';

export function AuthInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<any>> {
    const loggedIn = inject(AuthService).IsLoggedIn();
    // If the user is not logged in then skip the intercept
    if (!loggedIn) {
        return next(req);
    }

    const cloned = req.clone({
        withCredentials: true
    });

    return next(cloned);
}
