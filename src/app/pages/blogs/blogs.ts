import {Component, inject, signal} from '@angular/core';
import {Blog} from '../../models/Blog';
import {ActivatedRoute, Router} from '@angular/router';
import {BlogService} from '../../services/blog.service';
import {MarkdownComponent} from 'ngx-markdown';
import {AuthService} from '../../services/AuthService';
import {formatDate} from '../../services/DateTimeHelper';

@Component({
  selector: 'app-blogs',
  imports: [
    MarkdownComponent
  ],
  templateUrl: './blogs.html',
  styleUrl: './blogs.css'
})
export class Blogs {
  private blogService = inject(BlogService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  blog = signal<Blog | undefined>(undefined);
  user = this.authService.getUser();

  constructor() {
    const blogId = this.route.snapshot.paramMap.get('blogId');
    if (!blogId) return;

    this.blogService.getBlog(blogId).subscribe({
        next: (res) => {
          this.blog.set(res);
        }
      }
    );
  }

  return() {
    this.router.navigate(['Blogs']).then(() => {});
  }

  edit(id: string) {
    this.router.navigate(['Blog/Me/Edit', id]).then(() => {});
  }

  protected readonly formatDate = formatDate;
}
