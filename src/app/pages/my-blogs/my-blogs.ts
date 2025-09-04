import {Component, inject, signal} from '@angular/core';
import {Blog} from '../../models/Blog';
import {BlogService} from '../../services/blog.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-my-blogs',
  imports: [],
  templateUrl: './my-blogs.html',
  styleUrl: './my-blogs.css'
})
export class MyBlogs {
  blogs = signal<Array<Blog>>([])
  private blogService: BlogService = inject(BlogService);
  private router = inject(Router);

  constructor() {
    this.blogService.getBlogsWithAuthor('Yannick').subscribe((blogs: Blog[]) => {
      this.blogs.set(blogs);
    })
  }

  showDetails(id: string) {
    this.router.navigate([`Blogs`, id]).then(() => {});
  }
}
