import {Component, effect, ElementRef, input, OnDestroy, OnInit, output, QueryList, ViewChildren} from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    ValidationErrors,
    ValidatorFn,
    Validators
} from '@angular/forms';
import {Subscription} from 'rxjs';
import {CommonModule} from "@angular/common";

@Component({
    selector: 'app-form',
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule
    ],
    templateUrl: './form.html',
    styleUrl: './form.scss'
})
export class Form implements OnInit, OnDestroy {
    data = input<Array<Field>>([])
    title = input<string>('')
    errorMessage = input<string | undefined>(undefined);
    formValidators = input<ValidatorFn[]>([]);
    showValidationErrors = input<boolean>(false);
    onValidSubmit = output<any>()
    validityChange = output<boolean>();
    onFormErrorsChange = output<ValidationErrors | null>();
    onFileSelected = output<{ key: string, file: File }>();
    form: FormGroup = new FormGroup({});
    @ViewChildren('fileInput') fileInputs!: QueryList<ElementRef>;
    private formBuilder = new FormBuilder();
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

    onSubmit() {
        if (this.form.invalid) {
            return;
        }

        this.onValidSubmit.emit(this.form.value);
    }

    public isValid(): boolean {
        return this.form.valid;
    }

    onFileChange(event: Event, key: string) {
        const input = event.target as HTMLInputElement;
        if (input.files?.length) {
            const file = input.files[0];
            this.onFileSelected.emit({key, file});
            this.form.get(key)?.patchValue(file.name);
        }
    }

    public resetForm() {
        this.form.reset();
        this.fileInputs.forEach(input => input.nativeElement.value = '');
    }

    private updateForm(data: Array<Field>) {
        this.valueChangesSub?.unsubscribe();

        const controls: any = {};
        data.forEach((field: Field) => {
            const value = {value: field.value || '', disabled: field.disabled || false};
            const validators = field.required ? [Validators.required] : [];
            controls[field.key] = [value, validators];
            if (field.type === "email") {
                validators.push(Validators.email)
            }
        });
        this.form = this.formBuilder.group(controls, {validators: this.formValidators()});

        this.validityChange.emit(this.form.valid);

        this.valueChangesSub = this.form.valueChanges.subscribe(() => {
            this.validityChange.emit(this.form.valid);
        });

        this.form.statusChanges.subscribe(() => {
            this.onFormErrorsChange.emit(this.form.errors);
        });
    }
}

export interface Field {
    label: string;
    key: string;
    type: string;
    required?: boolean;
    options?: Array<{ value: string, label: string, disabled?: boolean }>;
    disabled?: boolean;
    value?: string;
}

