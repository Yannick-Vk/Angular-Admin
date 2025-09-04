import {Component, inject, input} from '@angular/core';
import {Blog} from '../../models/Blog';
import {Router} from '@angular/router';
import {DateTime} from 'luxon';

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

  formatDate(date: string) {
    return DateTime.fromISO(date).toLocaleString(DateTime.DATETIME_MED);
  }
}
