import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './AuthService';
import { api_base_url } from './Api';

/**
 * Intercepts HTTP 401 Unauthorized responses and delegates to the AuthService
 * to handle token refreshing and request retries.
 */
export function errorInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error) => {
      // Check for 401 error from our API.
      // We also add a check to avoid a retry loop if the refresh token request itself fails.
      if (
        error instanceof HttpErrorResponse &&
        error.status === 401 &&
        req.url.startsWith(api_base_url) &&
        !req.url.includes('/auth/refresh')
      ) {
        // The AuthService will handle the complex logic of refreshing the token
        // and retrying the request, including managing concurrent calls.
        // We will implement this method in the next step.
        return authService.handleRefreshAndRetry(req, next);
      }

      return throwError(() => error);
    })
  );
}
