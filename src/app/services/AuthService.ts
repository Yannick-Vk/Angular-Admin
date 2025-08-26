import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {catchError} from 'rxjs';
import {Jwt, LoginRequest} from '../models/Auth';
import moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private keys = {token: 'id_token', expiry: 'expires_at'}
  private client = inject(HttpClient)
  private baseUrl = 'http://localhost:5079/api/v1/auth';

  public Login(user: LoginRequest) {
    this.client.post<Jwt>(`${this.baseUrl}/login`, user)
      .pipe(catchError((error: HttpResponse<any>) => {
        console.error('Failed to login: ', error);
        throw error
      }))
      .subscribe(authResult => {
        // process the configuration.
        console.log(authResult);

        const expiresAt = moment().add(authResult.ExpiresIn, 'second');
        localStorage.setItem(this.keys.token, authResult.Token);
        localStorage.setItem(this.keys.expiry, JSON.stringify(expiresAt.valueOf()));
      });
  }

  public Logout() {
    localStorage.removeItem(this.keys.token);
    localStorage.removeItem(this.keys.expiry);
  }

  // Check if the expiration is set in local storage and if it's still valid
  public IsLoggedIn(): boolean {
    const expiration = localStorage.getItem(this.keys.expiry);
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
