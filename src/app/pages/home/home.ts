import {Component} from '@angular/core';
import {Blog} from '../../components/blog/blog';
import {UploadBlog} from '../../components/blog/upload-blog/upload-blog';

@Component({
  selector: 'home',
  imports: [
    Blog,
    UploadBlog
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})

export class HomeComponent {

}
