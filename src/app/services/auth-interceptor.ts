import {HttpEvent, HttpHandlerFn, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthService} from './AuthService';
import {inject} from '@angular/core';
import {api_base_url} from './Api';

export function AuthInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<any>> {
    const loggedIn = inject(AuthService).IsLoggedIn();

    if (loggedIn && req.url.startsWith(api_base_url)) {
        const cloned = req.clone({
            withCredentials: true,
        });

        return next(cloned);
    }

    return next(req);
}
