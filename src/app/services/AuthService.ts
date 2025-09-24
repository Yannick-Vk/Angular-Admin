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
    private logoutTimer: any;

    private isRefreshing = false;
    private refreshTokenSubject = new BehaviorSubject<any>(null);

    constructor() {
        super();
        this.initiateAutomaticLogout().then()
    }

    public async initiateAutomaticLogout(): Promise<void> {
        clearTimeout(this.logoutTimer);
        const expiry = this.expiration.get()
        if (!expiry) {
            console.error('Expiry expiry not set');
            await this.logoutAndRedirect();
            return;
        }

        const expiresIn = DateTime.fromISO(expiry).diff(DateTime.now()).as('milliseconds');
        if (expiresIn <= 0) {
            await this.logoutAndRedirect()
        } else {
            this.logoutTimer = setTimeout(async () => {
                await this.logoutAndRedirect();
            }, expiresIn);
        }
    }

    public Login(user: LoginRequest) {
        return this.client.post<User>(`${this.baseUrl()}/login`, user)
            .pipe(
                tap(authResult => this.HandleToken(authResult)),
                catchError((error: HttpResponse<any>) => {
                    console.error('Failed to login: ', error);
                    throw error;
                }));
    }

    Register(user: RegisterRequest) {
        return this.client.post<User>(`${this.baseUrl()}/register`, user)
            .pipe(
                tap(authResult => this.HandleToken(authResult)),
                catchError((error: HttpResponse<any>) => {
                    console.error('Failed to register: ', error);
                    throw error;
                }));
    }

    public Logout() {
        return this.client.post(`${this.baseUrl()}/logout`, {}).pipe(
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
        this.loggedIn.next(false);
        clearTimeout(this.logoutTimer);
        this.isRefreshing = false;
    }

    // Check if the expiration is set in local storage and if it's still valid
    public IsLoggedIn(): boolean {
        const isExpired = this.IsTokenExpired();
        if (isExpired) {
            console.error('Token is expired.');
            this.clearLocalSession();
            return false;
        }
        return true;
    }

    // Get User claims from token
    public getUser(): User | null {
        if (this.IsTokenExpired()) {
            this.logoutAndRedirect().then();
            return null;
        }

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
        // Prevent multiple refreshes
        if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);

            return this.refreshToken().pipe(
                switchMap(() => {
                    this.isRefreshing = false;
                    this.refreshTokenSubject.next(true);
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

    private refreshToken(): Observable<any> {
        return this.client.post(`${this.baseUrl()}/refresh`, {}, { withCredentials: true });
    }

    private async logoutAndRedirect() {
        console.log('Token expired, logging out and redirecting.');
        this.clearLocalSession();
        await this.router.navigate(['/Login']);
    }

    private async HandleToken(user: User) {
        // process the configuration.
        this.user.set(JSON.stringify(user));
        this.expiration.set(user.expiry.toString());
        this.loggedIn.next(true);
        await this.initiateAutomaticLogout();
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
