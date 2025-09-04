import {Component, inject, signal} from '@angular/core';
import {BlogPost} from '../../components/blog/blog-post.component';
import {BlogService} from '../../services/blog.service';
import {Blog} from '../../models/Blog';

@Component({
  selector: 'home',
  imports: [
    BlogPost
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})

export class HomeComponent {
  blogService = inject(BlogService);
  blogs = signal<Blog[]>([]);

  constructor() {
    this.getBlogPosts();
  }

  getBlogPosts(): void {
    this.blogService.getBlogPosts().subscribe((blogPosts) => {
      console.table(blogPosts);
      this.blogs.set(blogPosts);
    })
  }
}
