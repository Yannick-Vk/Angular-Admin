import {ChangeDetectionStrategy, Component, inject, signal, ViewChild} from '@angular/core';
import {BlogPost} from '../../components/blog/blog-post.component';
import {BlogService} from '../../services/blog.service';
import {Blog} from '../../models/Blog';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';

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
  private allBlogs = signal<Blog[]>([]);
  blogs = signal<Blog[]>([]);
  errorMessage = signal<string | null>(null)


  searchForm = new FormGroup({
    searchText: new FormControl('')
  })

  constructor() {
    this.getBlogPosts();
  }

  getBlogPosts(): void {
    this.blogService.getBlogPosts().subscribe((blogPosts) => {
      this.allBlogs.set(blogPosts);
      this.blogs.set(blogPosts);
    })
  }

  // Reset the filter
  private setUnfiltered() {
    this.blogs.set(this.allBlogs());
  }

  onSubmit() {
    this.errorMessage.set(null);
    let searchText = this.searchForm.controls.searchText.value;
    const filtered = this.filterBlogs(searchText);

    if (!filtered) {
      return;
    }

    if (filtered.length === 0) {
      this.setUnfiltered();
      this.errorMessage.set(`No blog's found with title: '${searchText}'`)
      return;
    }

    this.blogs.set(filtered);
  }

  filterBlogs(searchText: string | null): Array<Blog> | null {
    if (!searchText) {
      return null;
    }
    searchText = searchText.trim().toLowerCase();
    if (searchText === '') {
      return null;
    }

    return this.allBlogs().filter((blog: Blog) =>
      blog.title.toLowerCase().includes(searchText)
    );
  }

  clearSearch() {
    this.searchForm.controls.searchText.setValue('');
    this.setUnfiltered();
  }
}
