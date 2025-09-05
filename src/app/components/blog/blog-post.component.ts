import {Component, inject, input} from '@angular/core';
import {Blog} from '../../models/Blog';
import {Router} from '@angular/router';
import {formatDate} from '../../services/DateTimeHelper';
import {CopyToClipboard} from '../../services/LinkService';

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

  protected readonly formatDate = formatDate;

  //* Copy the link to the clipboard
  async copy(blogId: string) {
    await CopyToClipboard(`http://localhost:4200/Blogs/${blogId}`);
  };
}
