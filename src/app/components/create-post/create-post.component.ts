import { Component, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { PostsService } from '../../services/posts.service';
import { Post } from '../../models/Post';
import { first, tap } from 'rxjs';


@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.css'
})
export class CreatePostComponent implements OnInit {

  @ViewChild('formDirective') formDirective: NgForm = new NgForm([], []);
  @Output() create: EventEmitter<any> = new EventEmitter();

  postsForm: FormGroup = new FormGroup({});

  constructor(private authService: AuthService, private postsService: PostsService) {}

  ngOnInit(): void {
    this.postsForm = this.createFormGroup();
  }

  onSubmit(formData: Pick<Post, 'title' | 'body'>): void {

    
    this.postsService.createPost(formData)
      .pipe(first())
      .subscribe(() => {
        this.create.emit();
        this.formDirective.resetForm();
        console.log('Post created');
      });
  }

  createFormGroup(): FormGroup {
    return new FormGroup({
      title: new FormControl("", [Validators.required]),
      body: new FormControl("", [Validators.required])
    })
  }

  
}
