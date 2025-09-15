import {inject, Injectable} from '@angular/core';
import {AuthService} from './AuthService';
import {User} from '../models/Users';
import {HttpResponse} from '@angular/common/http';
import {catchError, of, tap} from 'rxjs';
import {HttpService} from './http-service';

@Injectable({
    'providedIn': 'root'
})
export class UserService extends HttpService {
    authService: AuthService = inject(AuthService);
    override path = 'users'

    public getUsers() {
        if (!this.authService.IsLoggedIn()) {
            console.error('Users not logged in');
            return of([]);
        }

        return this.client.get<Array<User>>(`${this.baseUrl()}`)
            .pipe(
                tap(authResult => {
                    return authResult;
                }),
                catchError((error: HttpResponse<any>) => {
                    console.error('Failed to get users: ', error);
                    throw error;
                }));
    }

    public getUser(username: string) {
        return this.client.get<User>(`${this.baseUrl()}/${username}`)
            .pipe(
                tap(authResult => {
                    return authResult;
                }),
                catchError((error: HttpResponse<any>) => {
                    console.error('Failed to get user: ', error);
                    throw error;
                }));
    }

    public getRoles(username: string) {
        //console.log(`Getting roles for ${username}`);
        return this.client.get<Array<string>>(`${this.baseUrl()}/${username}/Roles`).pipe(
            catchError((error: HttpResponse<any>) => {
                console.error('Failed to get roles: ', error);
                throw error;
            })
        )
    }

}

