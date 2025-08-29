import {Component, output, ViewChild} from '@angular/core';
import {Form} from '../../../components/forms/form/form';

@Component({
  selector: 'app-add-role-to-user',
  imports: [
    Form
  ],
  templateUrl: './add-role-to-user.html',
  styleUrl: './add-role-to-user.css'
})
export class AddRoleToUser {
  @ViewChild(Form) formComponent!: Form;
  addRole = output<string>()

  onSubmit(form: {RoleName: string}) {
    this.addRole.emit(form.RoleName)
  }

  isValid() {
    return this.formComponent?.isValid();
  }
}
