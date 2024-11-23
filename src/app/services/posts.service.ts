import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from '../models/User';
import { Post } from '../models/Post';
import { BehaviorSubject, Observable } from 'rxjs';
import { first, catchError, tap } from 'rxjs/operators';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private url = "http://54.165.119.117:3000/post";

  constructor(private http: HttpClient, private errorHandlerService: ErrorHandlerService, private router: Router) { }

  httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

  fetchAll(): Observable<Post[]> {
    return this.http
      .get<Post[]>(this.url, { responseType: 'json' })
      .pipe(
        catchError(this.errorHandlerService.handleError<Post[]>("fetchAll", []))
    );
  }

  fetchPost(id: number): Observable<Post> {
    return this.http
      .get<Post>(`${this.url}/${id}`, { responseType: 'json' })
      .pipe(
        first(),
        catchError(this.errorHandlerService.handleError<Post>("fetchPost"))
    );
  }

  createPost(formData: Partial<Post>): Observable<Post> {
    return this.http
      .post<Post>(this.url, { title: formData.title, body: formData.body, imageUrl: formData.imageUrl }, this.httpOptions)
      .pipe(
        first(),
        catchError(this.errorHandlerService.handleError<Post>("createPost"))
    );
  }
  
}
