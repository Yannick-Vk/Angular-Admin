import {Component, inject, input, signal} from '@angular/core';
import {Blog} from '../../models/Blog';
import {Router} from '@angular/router';

@Component({
  selector: 'app-blog',
  imports: [],
  templateUrl: './blog-post.component.html',
  styleUrl: './blog-post.component.css'
})
export class BlogPost {
  router = inject(Router)
  blog = input<Blog>({author: '', blogContent: '', createdAt: '', description: '', id: '', title: '', updatedAt: ''});

  readMore(id: string) {
    this.router.navigate([`Blogs/${id}`]).then()
  }
}
