import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {catchError} from 'rxjs';
import {LoggedInUser, LoginDto} from '../models/LoginDTO';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private client = inject(HttpClient)
  private baseUrl = 'http://localhost:5079/api/v1/auth';

  public Login(user: LoginDto) {
    this.client.post<LoggedInUser>(`${this.baseUrl}/login`, user)
      .pipe(catchError((error: HttpResponse<any>) => {
        console.error('Failed to login: ', error);
        throw error
      }))
      .subscribe(config => {
      // process the configuration.
      console.log(config);
    });
  }
}
