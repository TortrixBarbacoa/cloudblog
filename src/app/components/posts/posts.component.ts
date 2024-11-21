import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PostsService } from '../../services/posts.service';
import { AuthService } from '../../services/auth.service';
import { Post } from '../../models/Post';
import { User } from '../../models/User';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.css'
})
export class PostsComponent implements OnInit {

  posts$: Observable<Post[]> = new Observable<Post[]>();
  userId!: Pick<User, "id">;

  constructor(private authService: AuthService, private postsService: PostsService) {}

  ngOnInit(): void {
      this.posts$ = this.fetchAll();
      this.userId = this.authService.userId;
  }

  fetchAll() {
    return this.postsService.fetchAll();
  }

  createPost(): void {
    this.posts$ = this.fetchAll()
  }

}
