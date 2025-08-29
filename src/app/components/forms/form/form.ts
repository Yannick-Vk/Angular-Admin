import {Component, input, OnInit, output, signal} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-form',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './form.html',
  styleUrl: './form.scss'
})
export class Form implements OnInit {
  private formBuilder = new FormBuilder();
  data = input<Array<Field>>()
  title = input<string>('')
  onValidSubmit = output<any>()

  templateForm: FormGroup = new FormGroup({}) ;

  ngOnInit() {
    const controls: any = {};
    this.data()!.forEach((field: Field) => {
      const validators = field.required ? [Validators.required] : [];
      controls[field.key] = ["", validators];
    });
    this.templateForm = this.formBuilder.group(controls);
  }

  onSubmit() {
    if (this.templateForm.invalid) {
      return;
    }

    this.onValidSubmit.emit(this.templateForm.value);
  }

  public isValid(): boolean {
    return this.templateForm.valid;
  }
}

export interface Field {
  label: string;
  key: string;
  type: string;
  required: boolean;
}

