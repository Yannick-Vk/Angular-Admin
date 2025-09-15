import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {api_base_url} from './Api';

@Injectable({
    providedIn: 'root'
})
export class HttpService {
    protected client = inject(HttpClient)
    protected path = '';

    protected baseUrl() {
        return `${api_base_url}/${this.path}`;
    }

}
