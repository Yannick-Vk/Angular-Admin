import {Component, output, ViewChild} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {Form} from '../../../components/forms/form/form';

@Component({
    selector: 'add-role',
    imports: [
        ReactiveFormsModule,
        Form
    ],
    templateUrl: './add-role.html',
    styleUrl: './add-role.css'
})
export class AddRole {
    @ViewChild(Form) formComponent!: Form;
    addRole = output<string>()

    onSubmit(form: { RoleName: string }) {
        this.addRole.emit(form.RoleName)
    }

    isValid() {
        return this.formComponent?.isValid();
    }
}
