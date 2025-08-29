import {Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {LoginRequest} from '../../../models/Auth';

@Component({
  selector: 'add-role',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './add-role.html',
  styleUrl: './add-role.css'
})
export class AddRole {
  addRoleForm = new FormGroup({
    roleName: new FormControl('', Validators.required),
  })

  onSubmit() {
    if (this.addRoleForm.invalid) {
      return;
    }
    const form = this.addRoleForm.value;
  }
}
