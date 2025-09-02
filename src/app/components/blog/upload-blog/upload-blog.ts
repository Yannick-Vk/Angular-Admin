import {Component, ChangeDetectionStrategy, ViewChild} from '@angular/core';
import {Form} from '../../forms/form/form';
import {ReactiveFormsModule, ValidationErrors} from '@angular/forms';

@Component({
  selector: 'app-upload-blog',
  templateUrl: './upload-blog.html',
  styleUrl: './upload-blog.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Form,
    ReactiveFormsModule
  ]
})
export class UploadBlog {
  @ViewChild(Form) formComponent!: Form;
  errorMessage: string | undefined;
  showValidationErrors: boolean = false;
  selectedFile: File | null = null;

  onFormErrorsChanged(_: ValidationErrors | null): void {
  }

  isValid(): boolean {
    return this.formComponent?.isValid();
  }

  onSubmit($event: any): void {
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
