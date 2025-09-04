import {Component, inject, signal} from '@angular/core';
import {Blog} from '../../models/Blog';
import {BlogService} from '../../services/blog.service';
import {Router} from '@angular/router';
import {AuthService} from '../../services/AuthService';
import {formatDate} from '../../services/DateTimeHelper';

@Component({
  selector: 'app-my-blogs',
  imports: [],
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
      this.blogs.set(blogs);
    })
  }

  showDetails(id: string) {
    this.router.navigate([`Blogs`, id]).then(() => {});
  }

  edit(id: string) {
    this.router.navigate([`Blog/Me/Edit`, id]).then(() => {});
  }

  toNewBlog(): void {
    this.router.navigate([`Blog/Upload`]).then(() => {});
    return;
  }

  protected readonly formatDate = formatDate;
}
