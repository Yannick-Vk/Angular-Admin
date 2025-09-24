import {inject, Injectable} from '@angular/core';
import {HttpHandlerFn, HttpRequest, HttpResponse} from '@angular/common/http';
import {BehaviorSubject, catchError, filter, Observable, switchMap, take, tap, throwError} from 'rxjs';
import {LoginRequest, RegisterRequest} from '../models/Auth';
import {DateTime} from 'luxon';
import {Item} from './LocalItemService';
import {HttpService} from './http-service';
import {Router} from '@angular/router';
import {User} from '../models/Users';

@Injectable({
    providedIn: 'root',
})
export class AuthService extends HttpService {
    router = inject(Router);
    override path = 'auth';
    private user = new Item('user');
    private expiration = new Item('expiration');
    private loggedIn = new BehaviorSubject<boolean>(this.IsLoggedIn());
    public isLoggedIn$ = this.loggedIn.asObservable();

    private isRefreshing = false;
    private refreshTokenSubject = new BehaviorSubject<any>(null);

    constructor() {
        super();
        this.validateTokenOnStartup().then();
    }

    /**
     * This method checks for an expired token when the application first loads.
     * If the token is expired, it attempts a refresh. It no longer uses a timer
     * to proactively log out the user.
     */
    private async validateTokenOnStartup(): Promise<void> {
        const expiry = this.expiration.get();
        if (!expiry) {
            // No expiration means no session, so do nothing.
            return;
        }

        const expiresIn = DateTime.fromISO(expiry).diff(DateTime.now()).as('milliseconds');
        if (expiresIn <= 0) {
            // If token is expired on startup, try to refresh it immediately.
            console.log('Access token expired on load, attempting to refresh...');
            this.refreshToken().pipe(catchError(() => {
                console.error('Failed to refresh token on startup, logging out.');
                this.logoutAndRedirect().then();
                return throwError(() => 'Failed to refresh token on startup');
            })).subscribe({
                next: (user) => {
                    this.HandleToken(user);
                    console.log('Token refreshed successfully on startup.');
                }
            });
        }
        // The timer-based logout has been removed.
    }

    public Login(user: LoginRequest) {
        return this.client.post<User>(`${this.baseUrl()}/login`, user, { withCredentials: true })
            .pipe(
                tap(authResult => this.HandleToken(authResult)),
                catchError((error: HttpResponse<any>) => {
                    console.error('Failed to login: ', error);
                    throw error;
                }));
    }

    Register(user: RegisterRequest) {
        return this.client.post<User>(`${this.baseUrl()}/register`, user, { withCredentials: true })
            .pipe(
                tap(authResult => this.HandleToken(authResult)),
                catchError((error: HttpResponse<any>) => {
                    console.error('Failed to register: ', error);
                    throw error;
                }));
    }

    public Logout() {
        return this.client.post(`${this.baseUrl()}/logout`, {}, { withCredentials: true }).pipe(
            tap({
                next: () => this.clearLocalSession(),
                error: () => {
                    console.error('Backend logout failed, clearing local session anyway.');
                    this.clearLocalSession();
                }
            })
        );
    }

    public clearLocalSession() {
        this.user.remove();
        this.expiration.remove();
        this.loggedIn.next(false);
        this.isRefreshing = false;
    }

    /**
     * Checks if user and expiration data exist in storage.
     * This determines if the app considers a user to be in a logged-in state.
     * It does NOT check if the token is expired, as the interceptor handles that.
     */
    public IsLoggedIn(): boolean {
        return !!this.user.get() && !!this.expiration.get();
    }

    /**
     * Gets user claims from storage.
     * It does NOT check if the token is expired, as the interceptor handles that.
     */
    public getUser(): User | null {
        const userStr = this.user.get();
        if (!userStr) return null;

        const user: User = JSON.parse(userStr);
        const expiryDate = DateTime.fromISO(user.expiry);

        console.info(`Token expires ${expiryDate.toRelative()}`);

        return {
            id: user.id,
            username: user.username,
            email: user.email,
            expiry: user.expiry,
        };
    }

    handleRefreshAndRetry(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<any> {
        if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);

            return this.refreshToken().pipe(
                switchMap((user: User) => {
                    this.isRefreshing = false;
                    this.refreshTokenSubject.next(user);
                    this.HandleToken(user);
                    return next(req);
                }),
                catchError((error) => {
                    this.isRefreshing = false;
                    this.logoutAndRedirect().then();
                    return throwError(() => error);
                })
            );
        } else {
            return this.refreshTokenSubject.pipe(
                filter(result => result !== null),
                take(1),
                switchMap(() => next(req))
            );
        }
    }

    private refreshToken(): Observable<User> {
        return this.client.post<User>(`${this.baseUrl()}/refresh`, {}, { withCredentials: true });
    }

    private async logoutAndRedirect() {
        console.log('Logging out and redirecting.');
        this.clearLocalSession();
        await this.router.navigate(['/Login']);
    }

    private HandleToken(user: User) {
        this.user.set(JSON.stringify(user));
        this.expiration.set(user.expiry.toString());
        this.loggedIn.next(true);
    }

    private IsTokenExpired(): boolean {
        const str = this.expiration.get();
        if (!str) {
            console.error('Token was null');
            return true;
        }

        const expiry = Number(str);
        if (expiry <= 0) {
            console.error('Token was not a number');
            return true;
        }

        return DateTime.fromSeconds(expiry) < DateTime.now();
    }
}
