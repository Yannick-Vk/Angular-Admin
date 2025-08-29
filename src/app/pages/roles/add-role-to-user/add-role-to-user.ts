import {Component, input, output, ViewChild} from '@angular/core';
import {Form} from "../../../components/forms/form/form";

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
  addRole = output<{RoleName: string, Username: string}>()
  options = input<string[]>()

  onSubmit(form: {RoleName: string, Username: string}) {
    this.addRole.emit(form)
  }

  isValid() {
    return this.formComponent?.isValid();
  }
}