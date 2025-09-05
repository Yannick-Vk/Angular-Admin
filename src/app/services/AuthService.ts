import {inject, Injectable} from '@angular/core';
import {HttpResponse} from '@angular/common/http';
import {BehaviorSubject, catchError, tap} from 'rxjs';
import {Jwt, LoginRequest, RegisterRequest} from '../models/Auth';
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

  override path = 'auth'

  public Login(user: LoginRequest) {
    return this.client.post<Jwt>(`${this.baseUrl()}/login`, user)
      .pipe(
        tap(authResult => this.HandleToken(authResult)),
        catchError((error: HttpResponse<any>) => {
          console.error('Failed to login: ', error);
          throw error
        }));
  }

  Register(user: RegisterRequest) {
    return this.client.post<Jwt>(`${this.baseUrl()}/register`, user)
      .pipe(
        tap(authResult => this.HandleToken(authResult)),
        catchError((error: HttpResponse<any>) => {
          console.error('Failed to register: ', error);
          throw error
        }));
  }

  private HandleToken(token: Jwt) {
    // process the configuration.
    const expiresAt = DateTime.fromISO(String(token.expiration));
    console.log('Token expires at:',
      expiresAt.toLocaleString(DateTime.DATETIME_FULL),
      expiresAt.diff(DateTime.now()).toFormat("'in' mm 'minutes'"));

    this.token.set(token.token);
    this.loggedIn.next(true);
  }

  public Logout() {
    this.token.remove();
    this.loggedIn.next(false);
  }

  public GetToken() {
    return this.token.get();
  }

  // Check if the expiration is set in local storage and if it's still valid
  public IsLoggedIn(): boolean {
    const isExpired = this.IsTokenExpired(this.GetTokenClaims()["exp"])
    if (isExpired) {
      console.error('Invalid Expiration was set');
      return false;
    }
    return true;
  }

  private IsTokenExpired(expiry: number) {
    return DateTime.fromSeconds(expiry) < DateTime.now();
  }

  private GetTokenClaims(): any | null {
    const token = this.token.get();
    if (!token) return null;

    const arrayToken = token.split('.');
    return JSON.parse(atob(arrayToken[1]));
  }

  // Get User claims from token
  public getUser(): User | null {
    const token = this.GetTokenClaims()
    if (!token) return null;

    const diff = DateTime.fromSeconds(token["exp"]).diffNow();
    if (this.IsTokenExpired(token["exp"])) {
      console.error(diff.toFormat("'Token expired' HH 'hours and' mm 'minutes ago'"));
      return null;
    }
    console.info(`${diff.toFormat("'Token expires in' mm 'minutes'")}`);

    return {
      id: token["Id"],
      email: token["Email"],
      username: token["Username"],
    };
  }
}
