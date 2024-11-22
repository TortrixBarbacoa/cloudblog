import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { AuthService } from '../../services/auth.service';
import { PostsService } from '../../services/posts.service';
import { Post } from '../../models/Post';
import { first } from 'rxjs';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {

  @ViewChild('formDirective') formDirective: NgForm = new NgForm([], []);
  @Output() create: EventEmitter<any> = new EventEmitter();

  postsForm: FormGroup = new FormGroup({});
  selectedFile: File | null = null;

  constructor(private authService: AuthService, private postsService: PostsService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.postsForm = this.createFormGroup();
  }

  createFormGroup(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      body: ['', [Validators.required, Validators.minLength(10)]],
      imageUrl: ['']
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  async onSubmit(formData: Pick<Post, 'title' | 'body' | 'imageUrl'>): Promise<void> {
    if (this.postsForm.valid && this.selectedFile) {
      try {
        const uploadResult = await this.uploadFileToS3(this.selectedFile);
        console.log(uploadResult); 
        const imageUrl = uploadResult; 
        formData = { ...formData, imageUrl };
        this.postsService.createPost(formData)
        .pipe(first())
        .subscribe(() => {
        this.create.emit();
        this.formDirective.resetForm();
        console.log('Post created');
      });
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  }

  async uploadFileToS3(file: File): Promise<string> {
    const s3Client = new S3Client({
      region: 'us-east-1',
      credentials: {
        accessKeyId: 'AKIAY6QVY3VJTHEB5THA',
        secretAccessKey: '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'
      }
    });
  
    const bucketName = 'cloudblogimagesbucket';
    const key = file.name;
  
    try {
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: file,
        ACL: 'public-read'
      });
  
      await s3Client.send(command);
  
      const region = s3Client.config.region;
      return `https://${bucketName}.s3.us-east-1.amazonaws.com/${key}`;
    } catch (error) {
      console.error('Error during file upload:', error);
      throw error;
    }
  }
}