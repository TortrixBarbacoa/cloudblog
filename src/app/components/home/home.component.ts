import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PostsService } from '../../services/posts.service';
import { AuthService } from '../../services/auth.service';
import { Post } from '../../models/Post';
import { User } from '../../models/User';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

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
    this.posts$ = this.fetchAll();
  }
}
