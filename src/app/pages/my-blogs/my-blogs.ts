import {Component, inject, signal} from '@angular/core';
import {Blog} from '../../models/Blog';
import {BlogService} from '../../services/blog.service';
import {Router} from '@angular/router';
import {AuthService} from '../../services/AuthService';
import {BlogPost} from '../../components/blog/blog-post.component';

@Component({
  selector: 'app-my-blogs',
  imports: [
    BlogPost
  ],
  templateUrl: './my-blogs.html',
  styleUrl: './my-blogs.css'
})
export class MyBlogs {
  blogs = signal<Array<Blog>>([])
  private blogService = inject(BlogService);
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    const user = this.authService.getUser();
    if (!user) {
      console.error('User was not loggedIn');
      this.router.navigate(['/Login']).then(() => {});
      return;
    }

    this.blogService.getBlogsWithAuthor(user.username).subscribe((blogs: Blog[]) => {
      console.table(blogs);
      this.blogs.set(blogs);
    })
  }

  toNewBlog(): void {
    this.router.navigate([`Blog/Upload`]).then(() => {});
    return;
  }
}
