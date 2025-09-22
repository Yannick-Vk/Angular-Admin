import {Injectable} from '@angular/core';
import {HttpService} from './http-service';
import {catchError, Observable} from 'rxjs';
import {HttpResponse} from '@angular/common/http';
import {Blog, BlogUpdate, BlogUpload} from '../models/Blog';

@Injectable({
    providedIn: 'root',
})
export class BlogService extends HttpService {
    override path = 'blogs';

    uploadBlog(blog: BlogUpload) {
        return this.client.post<string>(`${this.baseUrl()}`, blog).pipe(
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

    getBlog(id: string) {
        return this.client.get<Blog>(`${this.baseUrl()}/${id}`).pipe(
            catchError((error: HttpResponse<any>) => {
                console.error(`Failed to get blog with id [${id}]:`, error);
                throw error;
            })
        )
    }

    getBlogsWithAuthor(authorName: string) {
        return this.client.get<Array<Blog>>(`${this.baseUrl()}/author/me`).pipe(
            catchError((error: HttpResponse<any>) => {
                console.error(`Failed to get blog's for [${authorName}]:`, error);
                throw error;
            })
        )
    }

    updateBlog(blog: BlogUpdate) {
        return this.client.patch(`${this.baseUrl()}`, blog).pipe(
            catchError((error: HttpResponse<any>) => {
                console.error(`Failed to update [${blog.title}]: ${error}`);
                throw error;
            })
        )
    }

    deleteBlog(id: string) {
        return this.client.delete(`${this.baseUrl()}/${id}`).pipe(
            catchError((error: HttpResponse<any>) => {
                console.error(`Failed to delete blog with id [${id}]: ${error}`);
                throw error;
            })
        )
    }

    searchBlog(searchText: string) {
        return this.client.get<Array<Blog>>(`${this.baseUrl()}/search/${searchText}`).pipe(
            catchError((error: HttpResponse<any>) => {
                console.error(`Failed to find blogs with '${searchText}': ${error}`)
                throw error;
            })
        )
    }
}
