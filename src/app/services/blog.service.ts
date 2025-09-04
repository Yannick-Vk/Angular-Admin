import {Injectable} from '@angular/core';
import {HttpService} from './http-service';
import {catchError, Observable} from 'rxjs';
import {HttpResponse} from '@angular/common/http';
import {Blog, BlogUpload} from '../models/Blog';
import {BlogPost} from '../components/blog/blog-post.component';

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

  getBlogPosts(): Observable<Array<Blog>> {
    return this.client.get<Array<Blog>>(`${this.baseUrl()}`).pipe(
      catchError((error: HttpResponse<any>) => {
        console.error('Failed to get blogs: ', error);
        throw error;
      })
    );
  }
}
