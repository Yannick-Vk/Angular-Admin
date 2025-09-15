import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
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
    blogs = signal<Blog[]>([]);
    errorMessage = signal<string | null>(null)
    searchForm = new FormGroup({
        searchText: new FormControl('')
    })
    private allBlogs = signal<Blog[]>([]);

    constructor() {
        this.getBlogPosts();
    }

    getBlogPosts(): void {
        this.blogService.getBlogPosts().subscribe((blogPosts) => {
            this.allBlogs.set(blogPosts);
            this.blogs.set(blogPosts);
        })
    }

    onSubmit() {
        this.errorMessage.set(null);
        const searchText = this.searchForm.controls.searchText.value;

        if (!searchText || searchText.trim() === '') {
            this.setUnfiltered();
            return;
        }

        const filtered = this.filterBlogs(searchText);

        if (filtered.length === 0) {
            this.errorMessage.set(`No blogs found with title: '${searchText}'`);
        }

        this.blogs.set(filtered);
    }

    filterBlogs(searchText: string): Array<Blog> {
        const search = searchText.trim().toLowerCase();
        return this.allBlogs().filter((blog: Blog) =>
            blog.title.toLowerCase().includes(search)
        );
    }

    clearSearch() {
        this.searchForm.controls.searchText.setValue('');
        this.setUnfiltered();
    }

    // Reset the filter
    private setUnfiltered() {
        this.blogs.set(this.allBlogs());
    }
}
