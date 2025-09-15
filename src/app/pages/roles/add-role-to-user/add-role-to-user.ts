import {Component, computed, input, output, ViewChild} from '@angular/core';
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
  errorMessage = input<string | undefined>(undefined);

  formOptions = computed(() => {
    const opts = this.options();
    if (!opts) return [];
    return opts.map(opt => ({ label: opt, value: opt }));
  })

  formData = computed(() => {
    const options = this.formOptions();
    const initialValue = options.length > 0 ? options[0].value : '';
    return [
      { label: "Role name", key: "RoleName", type: "select", options: options, required: true, value: initialValue },
      { label: "Username", key: "Username", type: "text", required: true },
    ];
  });

  onSubmit(form: {RoleName: string, Username: string}) {

    if (!form.RoleName) {
      console.error('Please select a Role');
      return;
    }
    this.addRole.emit(form)
  }

  isValid() {
    return this.formComponent?.isValid();
  }
}
