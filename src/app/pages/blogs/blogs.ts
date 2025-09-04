import {Component, inject, input} from '@angular/core';
import {Blog} from '../../models/Blog';
import {ActivatedRoute, Router} from '@angular/router';
import {BlogService} from '../../services/blog.service';
import {MarkdownComponent} from 'ngx-markdown';

@Component({
  selector: 'app-blogs',
  imports: [
    MarkdownComponent
  ],
  templateUrl: './blogs.html',
  styleUrl: './blogs.css'
})
export class Blogs {
  blogService = inject(BlogService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  blog: Blog = {
    id: "",
    title: "",
    description: "",
    blogContent: "",
    author: "",
    createdAt: "",
    updatedAt: ""
  };

  constructor() {
    const blogId = this.route.snapshot.paramMap.get('blogId');
    if (!blogId) return;

    this.blogService.getBlog(blogId).subscribe({
        next: (res) => {
          this.blog = res;
        }
      }
    );
  }

  return() {
    this.router.navigate(['Blogs']).then(() => {});
  }
}
