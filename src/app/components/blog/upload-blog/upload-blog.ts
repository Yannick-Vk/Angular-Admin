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
    console.log($event);
  }

  clear(): void {
    this.formComponent.form.reset();
  }
}
