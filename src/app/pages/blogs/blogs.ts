import {Component, inject, signal} from '@angular/core';
import {Blog} from '../../models/Blog';
import {ActivatedRoute, Router} from '@angular/router';
import {BlogService} from '../../services/blog.service';
import {MarkdownComponent} from 'ngx-markdown';
import {AuthService} from '../../services/AuthService';
import {formatDate} from '../../services/DateTimeHelper';
import {CopyBlogToClipboard} from '../../services/LinkService';

@Component({
    selector: 'app-blogs',
    imports: [
        MarkdownComponent
    ],
    templateUrl: './blogs.html',
    styleUrl: './blogs.css'
})
export class Blogs {
    blog = signal<Blog | undefined>(undefined);
    protected readonly formatDate = formatDate;
    private blogService = inject(BlogService);
    private authService = inject(AuthService);
    user = this.authService.getUser();
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    constructor() {
        const blogId = this.route.snapshot.paramMap.get('blogId');
        if (!blogId) return;

        this.blogService.getBlog(blogId).subscribe({
            next: (res) => {
                if (!res) {
                    this.router.navigate(['/Blogs']).then();
                    return;
                }
                this.blog.set(res);
            },
            error: (err) => {
                console.error(`Error getting blog ${blogId}:`, err);
                this.router.navigate(['/Blogs']).then();
            }
        });
    }

    async return() {
        await this.router.navigate(['Blogs']);
    }

    async edit(id: string) {
        await this.router.navigate(['Blog/Me/Edit', id]);
    }

    //* Copy the link to the clipboard
    async copy() {
        const id = this.blog()?.id;
        if (!id) return;

        await CopyBlogToClipboard(id);
    }
}
