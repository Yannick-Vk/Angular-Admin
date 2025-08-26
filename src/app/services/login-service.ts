import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private client = inject(HttpClient)

  public get() {
    this.client.get('https://jsonplaceholder.typicode.com/todos/1').subscribe(config => {
      // process the configuration.
      console.log(config);
    });
  }
}
