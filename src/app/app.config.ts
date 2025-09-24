import {ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideHttpClient, withFetch, withInterceptors, withJsonpSupport} from '@angular/common/http';
import {AuthInterceptor} from './interceptors/auth-interceptor';
import {provideMarkdown} from 'ngx-markdown';
import {errorInterceptor} from './interceptors/error-interceptor';

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideZoneChangeDetection({eventCoalescing: true}),
        provideRouter(routes),
        provideHttpClient(withFetch(), withJsonpSupport(), withInterceptors([AuthInterceptor, errorInterceptor])),
        provideMarkdown(),
    ],
};
