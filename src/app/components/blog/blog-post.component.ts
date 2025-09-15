import {Component, inject, input} from '@angular/core';
import {Blog} from '../../models/Blog';
import {Router} from '@angular/router';
import {formatDate} from '../../services/DateTimeHelper';
import {CopyBlogToClipboard} from '../../services/LinkService';

@Component({
    selector: 'app-blog',
    imports: [],
    templateUrl: './blog-post.component.html',
    styleUrl: './blog-post.component.css'
})
export class BlogPost {
    router = inject(Router)
    blog = input<Blog>({author: '', blogContent: '', createdAt: '', description: '', id: '', title: '', updatedAt: ''});
    enableEdit = input<boolean>(false);
    protected readonly formatDate = formatDate;

    async readMore(id: string) {
        await this.router.navigate([`Blogs/${id}`])
    }

    //* Copy the link to the clipboard
    async copy(blogId: string) {
        await CopyBlogToClipboard(blogId);
    };

    async edit(id: string) {
        await this.router.navigate([`Blog/Me/Edit`, id]);
    }
}
