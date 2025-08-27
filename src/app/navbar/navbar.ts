import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import {routes} from '../app.routes';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {

  protected readonly routes = routes;
}
