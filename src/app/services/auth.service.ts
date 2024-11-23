import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, first, tap } from 'rxjs/operators';
import { User } from '../models/User';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = 'http://54.165.119.117:3000/auth';
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  userId!: Pick<User, "id">;
  isUserLoggedIn$ = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private router: Router,
    private errorHandlerService: ErrorHandlerService
  ) {
    this.initializeAuthState();
  }

  private initializeAuthState(): void {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        this.isUserLoggedIn$.next(true);
        this.httpOptions.headers = this.httpOptions.headers.set('Authorization', `Bearer ${token}`);
      }
    }
  }

  // Sign Up Service //
  signUp(user: Omit<User, "id">): Observable<User> {
    return this.http.post<User>(`${this.url}/signup`, user, this.httpOptions).pipe(
      first(),
      tap(() => {
        this.router.navigate(['/login']);
      }),
      catchError(this.errorHandlerService.handleError<User>("signUp")),
    );
  }

  // Login Service //
  login(username: string, password: string): Observable<{ token: string; userId: Pick<User, 'id'> }> {
    return this.http
      .post<{ token: string; userId: Pick<User, 'id'> }>(`${this.url}/login`, { username, password }, this.httpOptions)
      .pipe(
        first(),
        tap((tokenObject: { token: string; userId: Pick<User, 'id'> }) => {
          localStorage.setItem('token', tokenObject.token);
          this.httpOptions.headers = this.httpOptions.headers.set('Authorization', `Bearer ${tokenObject.token}`);
          this.isUserLoggedIn$.next(true);
          this.router.navigate(['/home']);
        }),
        catchError(this.errorHandlerService.handleError<{ token: string; userId: Pick<User, 'id'> }>('login'))
      );
  }

  logout(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('token');
    }
    this.httpOptions.headers = this.httpOptions.headers.delete('Authorization');
    this.isUserLoggedIn$.next(false);
    this.router.navigate(['/login']);
  }
}
