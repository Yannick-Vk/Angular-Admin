import {ChangeDetectionStrategy, Component, inject, ViewChild} from '@angular/core';
import {Form} from '../../forms/form/form';
import {ReactiveFormsModule, ValidationErrors} from '@angular/forms';
import {BlogService} from "../../../services/blog.service";
import {HttpErrorResponse} from "@angular/common/http";
import {CommonModule} from "@angular/common";
import {BlogUpload} from "../../../models/Blog";
import {AuthService} from '../../../services/AuthService';

@Component({
  selector: 'app-upload-blog',
  templateUrl: './upload-blog.html',
  styleUrl: './upload-blog.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    Form,
    ReactiveFormsModule,
    CommonModule
  ]
})
export class UploadBlog {
  @ViewChild(Form) formComponent!: Form;
  private blogService = inject(BlogService);
  private authService = inject(AuthService);

  errorMessage: string | undefined;
  successMessage: string | undefined;
  showValidationErrors: boolean = false;
  selectedFile: File | null = null;

  onFormErrorsChanged(_: ValidationErrors | null): void {
  }

  isValid(): boolean {
    return this.formComponent?.isValid();
  }

  onSubmit(formValue: { Title: string, Description: string }): void {
    this.showValidationErrors = true;
    if (!this.formComponent?.isValid()) {
      return;
    }

    if (!this.selectedFile) {
      this.errorMessage = 'Please select a file to upload';
      return;
    }

    const fileName = this.selectedFile.name;
    const fileExt = fileName.split('.').pop()?.toLocaleLowerCase();

    if (fileExt !== 'md') {
      this.errorMessage = 'Invalid file type. Please upload a .md file.';
      return;
    }

    this.errorMessage = undefined;
    this.successMessage = undefined;

    const userData: string | undefined = this.authService.getUser()?.username;
    if (!userData) return;

    // Read file as raw UTF8 string
    const reader = new FileReader();
    reader.readAsText(this.selectedFile, 'UTF-8');
    reader.onload = () => {
      const rawFileContent = reader.result as string;
      const blogUpload: BlogUpload = {
        Title: formValue.Title,
        Description: formValue.Description,
        File: rawFileContent,
        Author: userData,
      };

      this.blogService.uploadBlog(blogUpload).subscribe({
        next: () => {
          this.successMessage = 'Blog uploaded successfully!';
          this.formComponent.form.reset();
        },
        error: (err: HttpErrorResponse) => this.errorMessage = err.error.message,
      });
    };
    reader.onerror = (error) => {
      this.errorMessage = 'Error reading file: ' + error;
    };
  }

  clear(): void {
    this.formComponent.form.reset();
  }

  onFile(event: {key: string, file: File}) {
    if (event.key === 'Upload') {
      this.selectedFile = event.file;
    }
  }
}
