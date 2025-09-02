import {Injectable} from '@angular/core';
import {HttpService} from './http-service';
import {catchError} from 'rxjs';
import {HttpResponse} from '@angular/common/http';
import {BlogUpload} from '../models/Blog';

@Injectable({
  providedIn: 'root',
})
export class BlogService extends HttpService {
  override path = 'blogs';

  uploadBlog(blog: BlogUpload) {
    return this.client.post(`${this.baseUrl()}`, blog).pipe(
      catchError((error: HttpResponse<any>) => {
        console.error('Failed to upload blog: ', error);
        throw error;
      })
    );
  }
}
