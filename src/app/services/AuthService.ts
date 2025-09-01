import {inject, Injectable} from '@angular/core';
import {HttpResponse} from '@angular/common/http';
import {BehaviorSubject, catchError, tap} from 'rxjs';
import {Jwt, LoginRequest, RegisterRequest} from '../models/Auth';
import {DateTime} from 'luxon';
import {Item} from './LocalItemService';
import {HttpService} from './http-service';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends HttpService {
  router = inject(Router);
  private token = new Item('id_token');
  private expiration = new Item('expires_at');
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
    const expiresAt = DateTime.fromISO(String(token.Expiration));
    console.log('Token expires at:',
      expiresAt.toLocaleString(DateTime.DATETIME_FULL),
      expiresAt.diff(DateTime.now()).toFormat("'in' mm 'minutes'"));

    this.token.set(token.Token);
    this.expiration.set(JSON.stringify(DateTime.fromISO(String(token.Expiration))));
    this.loggedIn.next(true);
  }

  public Logout() {
    this.token.remove();
    this.expiration.remove();
    this.loggedIn.next(false);
  }

  public GetToken() {
    return this.token.get();
  }

  // Check if the expiration is set in local storage and if it's still valid
  public IsLoggedIn(): boolean {
    const expiration = this.expiration.get();
    if (!expiration) {
      console.error('Expiration not set.');
      return false;
    }
    try {
      const expiresAt = DateTime.fromISO(JSON.parse(expiration));
      const diff = expiresAt.diff(DateTime.now());
      const isExpired = diff.milliseconds <= 0;
      if (isExpired) {
        console.warn(diff.toFormat("'Token expired' HH 'hours and' mm 'minutes ago'"));
      } else {
        console.info(diff.toFormat("'Expires in' mm 'minutes'"));
      }
      return !isExpired;
    } catch (e) {
      console.info(this.token.get());
      console.error('Invalid Expiration was set', e);
    }
    return false;
  }

  public getUserData() {

  }
}
