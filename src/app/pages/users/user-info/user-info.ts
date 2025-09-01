import {Component, inject, signal} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-user-info',
  imports: [],
  templateUrl: './user-info.html',
  styleUrl: './user-info.css'
})
export class UserInfo {
  router = inject(Router)
  private route = inject(ActivatedRoute);

  userName: string | null;

  constructor() {
    this.userName = this.route.snapshot.paramMap.get('userName');
  }

}
