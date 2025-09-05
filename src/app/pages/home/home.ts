import {ChangeDetectionStrategy, Component, inject, signal, ViewChild} from '@angular/core';
import {BlogPost} from '../../components/blog/blog-post.component';
import {BlogService} from '../../services/blog.service';
import {Blog} from '../../models/Blog';
import {CopyToClipboard} from '../../services/LinkService';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {Form} from '../../components/forms/form/form';

@Component({
  selector: 'home',
  standalone: true,
  imports: [
    BlogPost,
    ReactiveFormsModule,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class HomeComponent {
  blogService = inject(BlogService);
  blogs = signal<Blog[]>([]);

  searchForm = new FormGroup({
    searchText: new FormControl('')
  })

  constructor() {
    this.getBlogPosts();
  }

  getBlogPosts(): void {
    this.blogService.getBlogPosts().subscribe((blogPosts) => {
      // console.table(blogPosts);
      this.blogs.set(blogPosts);
    })
  }

  onSubmit() {
    const searchText = this.searchForm.controls.searchText.value;
    if (!searchText || searchText === '') {
      this.getBlogPosts();
      return;
    }

    this.blogService.searchBlog(searchText).subscribe((blogPosts) => {
      this.blogs.set(blogPosts);
    })
  }
}
