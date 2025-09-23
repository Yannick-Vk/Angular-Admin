import {inject, Injectable} from '@angular/core';
import {HttpResponse} from '@angular/common/http';
import {BehaviorSubject, catchError, tap} from 'rxjs';
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
        this.user.remove();
        this.loggedIn.next(false);
        clearTimeout(this.logoutTimer);
    }

    // Check if the expiration is set in local storage and if it's still valid
    public IsLoggedIn(): boolean {
        const isExpired = this.IsTokenExpired();
        if (isExpired) {
            console.error('Token is expired.');
            this.Logout();
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

    private async logoutAndRedirect() {
        console.log('Token expired, logging out and redirecting.');
        this.Logout();
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
