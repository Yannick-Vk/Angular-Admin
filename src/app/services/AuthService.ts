import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {catchError} from 'rxjs';
import {Jwt, LoginRequest, RegisterRequest} from '../models/Auth';
import moment from 'moment';
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
    console.log(token);

    const expiresAt = moment().add(token.ExpiresIn, 'second');
    this.token.set(token.Token);
    this.expiration.set(JSON.stringify(expiresAt.valueOf()));
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
    const expiration = this.token.get();
    if (!expiration) {
      console.error('Expiration not set.');
      return false;
    }
    try {
      const expiresAt = JSON.parse(expiration);
      return moment().isBefore(expiresAt.valueOf());
    } catch (e) {
      console.error('Invalid Expiration was set');
    }
    return false;
  }
}
