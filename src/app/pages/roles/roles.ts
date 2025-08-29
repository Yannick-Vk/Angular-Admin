import { Component } from '@angular/core';
import {AddRole} from './add-role/add-role';

@Component({
  selector: 'roles',
  imports: [
    AddRole
  ],
  templateUrl: './roles.html',
  styleUrl: './roles.css'
})
export class Roles {

}
