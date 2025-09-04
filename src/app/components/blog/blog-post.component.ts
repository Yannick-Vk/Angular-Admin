import {Component, input, signal} from '@angular/core';
import {Blog} from '../../models/Blog';

@Component({
  selector: 'app-blog',
  imports: [],
  templateUrl: './blog-post.component.html',
  styleUrl: './blog-post.component.css'
})
export class BlogPost {
  blog = input<Blog>();
}
