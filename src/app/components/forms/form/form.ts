import {Component, effect, input, OnDestroy, OnInit, output} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-form',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './form.html',
  styleUrl: './form.scss'
})
export class Form implements OnInit, OnDestroy {
  private formBuilder = new FormBuilder();
  data = input<Array<Field>>([])
  title = input<string>('')
  errorMessage = input<string | undefined>(undefined);
  onValidSubmit = output<any>()
  validityChange = output<boolean>();

  form: FormGroup = new FormGroup({}) ;
  private valueChangesSub?: Subscription;

  constructor() {
    effect(() => {
      this.updateForm(this.data());
    });
  }

  ngOnInit() {
    this.updateForm(this.data());
  }

  ngOnDestroy() {
    this.valueChangesSub?.unsubscribe();
  }

  private updateForm(data: Array<Field>) {
    this.valueChangesSub?.unsubscribe();

    const controls: any = {};
    data.forEach((field: Field) => {
      const value = { value: field.value || '', disabled: field.disabled || false };
      const validators = field.required ? [Validators.required] : [];
      controls[field.key] = [value, validators];
      if (field.type === "email") {
        validators.push(Validators.email)
      }
    });
    this.form = this.formBuilder.group(controls);

    this.validityChange.emit(this.form.valid);

    this.valueChangesSub = this.form.valueChanges.subscribe(() => {
      this.validityChange.emit(this.form.valid);
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    this.onValidSubmit.emit(this.form.value);
  }

  public isValid(): boolean {
    return this.form.valid;
  }
}

export interface Field {
  label: string;
  key: string;
  type: string;
  required?: boolean;
  options?: Array<{value: string, label: string, disabled?: boolean}>;
  disabled?: boolean;
  value?: string;
}

