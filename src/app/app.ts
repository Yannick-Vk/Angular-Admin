import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {LoginForm} from './pages/login/LoginForm';
import {Navbar} from './navbar/navbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}
