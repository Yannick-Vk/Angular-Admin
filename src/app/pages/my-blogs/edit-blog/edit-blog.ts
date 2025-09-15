import {Component, inject, signal, ViewChild} from '@angular/core';
import {BlogService} from '../../../services/blog.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Blog, BlogUpdate} from '../../../models/Blog';
import {AuthService} from '../../../services/AuthService';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {Modal} from '../../../components/modal/modal';

@Component({
    selector: 'app-edit-blog',
    imports: [
        ReactiveFormsModule,
        Modal
    ],
    styleUrl: './edit-blog.scss',
    templateUrl: './edit-blog.html',

})
export class EditBlog {
    @ViewChild('confirmDeleteModal') confirmDeleteModal!: Modal;
    private blogService = inject(BlogService);
    private authService = inject(AuthService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    formEdit = new FormGroup({
        title: new FormControl(''),
        description: new FormControl(''),
        file: new FormControl(),
    })

    blog: Blog | undefined;
    errorMessage = signal<string>('');

    constructor() {
        const id = this.route.snapshot.params['blogId'];
        if (!id) {
            console.error('No parameter [blogId] was supplied');
            this.router.navigate(['/Login']).then();
            return;
        }

        const user = this.authService.getUser();
        if (!user) {
            console.error('User is not loggedIn');
            this.router.navigate(['/Login']).then();
            return;
        }

        this.blogService.getBlog(id).subscribe({
            next: (blog: Blog) => {
                if (blog.author !== user.username) {
                    console.error('Logged in user was not the author of this blog', user.username, blog.author);
                    this.router.navigate(['Blogs']).then();
                    return;
                }
                this.blog = blog
                this.formEdit.setControl('title', new FormControl(blog.title));
                this.formEdit.setControl("description", new FormControl(blog.description));
            },
            error: error => {
                console.warn(`Unknown blog with id ${id}:`, error)
                this.router.navigate(['/Home']).then()
            }
        })
    }

    // Only send the data if it's not updated
    onSubmit() {
        if (!this.blog) return;
        this.errorMessage.set('')
        const {title, description, file} = this.formEdit.value;

        const update: BlogUpdate = {id: this.blog.id};

        if (title && title !== this.blog.title) {
            update.title = title;
        }

        if (description && description !== this.blog.description) {
            update.description = description;
        }

        if (file && file.length > 0) {
            if (file !== this.blog.blogContent) {
                update.blogContent = file;
            }
        }

        if (Object.keys(update).length <= 1) {
            this.errorMessage.set("No changes were made")
            return;
        }

        this.blogService.updateBlog(update).subscribe(() => {
            this.router.navigate(['Blogs', this.blog!.id]).then()
        });
    }

    // Read the incoming file as a raw UTF8-string
    onFileChange(event: any) {
        const reader = new FileReader();

        if (event.target.files && event.target.files.length) {
            const [file] = event.target.files;
            reader.readAsText(file, 'UTF-8');

            reader.onload = () => {
                this.formEdit.patchValue({
                    file: reader.result as string
                });
            };
        }
    }

    deleteBlog() {
        if (!this.blog) return;
        this.confirmDeleteModal.title.set('Confirm delete');
        this.confirmDeleteModal.message.set(`Confirm delete of blog ${this.blog.title}?`);

        this.confirmDeleteModal.open();
    }

    confirmDelete() {
        if (!this.blog) return;
        this.blogService.deleteBlog(this.blog.id).subscribe(() => {
            this.router.navigate(['Blog/Me']).then();
        });
        this.confirmDeleteModal.close();
    }

    cancelDelete() {
        this.confirmDeleteModal.close();
    }

    back() {
        if (!this.blog) return;
        this.router.navigate(['Blogs', this.blog.id]).then();
        return;
    }
}
