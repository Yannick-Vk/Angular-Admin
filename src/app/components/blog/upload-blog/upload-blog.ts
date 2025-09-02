import { Component, ChangeDetectionStrategy } from '@angular/core';
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
  errorMessage: string | undefined;
  showValidationErrors: boolean = false;

  onFormErrorsChanged($event: ValidationErrors | null) {

  }

  isValid() {
    return false;
  }

  onSubmit($event: any) {

  }
}
