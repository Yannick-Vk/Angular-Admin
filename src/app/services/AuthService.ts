import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {catchError} from 'rxjs';
import {Jwt, LoginRequest, RegisterRequest} from '../models/Auth';
import {DateTime} from 'luxon';
import {Item} from './LocalItemService';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token = new Item('id_token');
  private expiration = new Item('expires_at');
  private client = inject(HttpClient)
  private baseUrl = 'https://localhost:7134/api/v1/auth';

  public Login(user: LoginRequest) {
    this.client.post<Jwt>(`${this.baseUrl}/login`, user)
      .pipe(catchError((error: HttpResponse<any>) => {
        console.error('Failed to login: ', error);
        throw error
      }))
      .subscribe(authResult => {
        this.HandleToken(authResult);
      });
  }

  Register(user: RegisterRequest) {
    this.client.post<Jwt>(`${this.baseUrl}/register`, user)
      .pipe(catchError((error: HttpResponse<any>) => {
        console.error('Failed to register: ', error);
        throw error
      }))
      .subscribe(authResult => {
        this.HandleToken(authResult);
      });
  }

  private HandleToken(token: Jwt) {
    // process the configuration.
    const expiresAt = DateTime.fromISO(String(token.Expiration));
    console.log('Token expires at:',
      expiresAt.toLocaleString(DateTime.DATETIME_FULL),
      expiresAt.diff(DateTime.now()).toFormat("'in' mm 'minutes'"));

    this.token.set(token.Token);
    this.expiration.set(JSON.stringify(DateTime.fromISO(String(token.Expiration))));
  }

  public Logout() {
    this.token.remove();
    this.expiration.remove();
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
}
