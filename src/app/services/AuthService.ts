import {inject, Injectable} from '@angular/core';
import {HttpResponse} from '@angular/common/http';
import {BehaviorSubject, catchError, tap} from 'rxjs';
import {Jwt, LoginRequest, RegisterRequest, TokenClaims} from '../models/Auth';
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
  private token = new Item('token');
  private loggedIn = new BehaviorSubject<boolean>(this.IsLoggedIn());
  public isLoggedIn$ = this.loggedIn.asObservable();
  private logoutTimer: any;

  override path = 'auth';

  constructor() {
    super();
    this.initiateAutomaticLogout().then()
  }

  private async logoutAndRedirect() {
    console.log('Token expired, logging out and redirecting.');
    this.Logout();
    await this.router.navigate(['/Login']);
  }

  public async initiateAutomaticLogout(): Promise<void> {
    clearTimeout(this.logoutTimer);
    const claims = this.GetTokenClaims();
    if (claims && claims.exp) {
      const expiresIn = DateTime.fromSeconds(claims.exp).diff(DateTime.now()).as('milliseconds');
      if (expiresIn <= 0) {
        await this.logoutAndRedirect()
      } else {
        this.logoutTimer = setTimeout(async () => {
          await this.logoutAndRedirect();
        }, expiresIn);
      }
    }
  }

  public Login(user: LoginRequest) {
    return this.client.post<Jwt>(`${this.baseUrl()}/login`, user)
      .pipe(
        tap(authResult => this.HandleToken(authResult)),
        catchError((error: HttpResponse<any>) => {
          console.error('Failed to login: ', error);
          throw error;
        }));
  }

  Register(user: RegisterRequest) {
    return this.client.post<Jwt>(`${this.baseUrl()}/register`, user)
      .pipe(
        tap(authResult => this.HandleToken(authResult)),
        catchError((error: HttpResponse<any>) => {
          console.error('Failed to register: ', error);
          throw error;
        }));
  }

  private async HandleToken(token: Jwt) {
    // process the configuration.
    this.token.set(token.token);
    this.loggedIn.next(true);
    await this.initiateAutomaticLogout();
  }

  public Logout() {
    this.token.remove();
    this.loggedIn.next(false);
    clearTimeout(this.logoutTimer);
  }

  public GetToken() {
    return this.token.get();
  }

  // Check if the expiration is set in local storage and if it's still valid
  public IsLoggedIn(): boolean {
    const token = this.GetToken();
    if (!token) {
      return false;
    }
    const isExpired = this.IsTokenExpired(this.GetTokenClaims()?.exp);
    if (isExpired) {
      console.error('Token is expired.');
      this.Logout();
      return false;
    }
    return true;
  }

  private IsTokenExpired(expiry: number | null | undefined): boolean {
    if (!expiry) return true;

    return DateTime.fromSeconds(expiry) < DateTime.now();
  }

  private GetTokenClaims(): TokenClaims | null {
    const token = this.token.get();
    if (!token) return null;

    const arrayToken = token.split('.');
    const claims = JSON.parse(atob(arrayToken[1]));
    return {
      exp: claims.exp,
      Id: claims.Id,
      Username: claims.Username,
      Email: claims.Email,
    };
  }

  // Get User claims from token
  public getUser(): User | null {
    const token = this.GetTokenClaims();
    if (!token || !token.exp) return null;

    if (this.IsTokenExpired(token.exp)) {
      this.logoutAndRedirect().then();
      return null;
    }

    const expiryDate = DateTime.fromSeconds(token.exp);
    console.info(`Token expires ${expiryDate.toRelative()}`);

    return {
      id: token.Id,
      email: token.Email,
      username: token.Username,
    };
  }
}
