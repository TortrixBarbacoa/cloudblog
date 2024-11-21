import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup = new FormGroup({});

  constructor(private authService: AuthService) {

  }

  ngOnInit(): void {
      this.loginForm = this.createFormGroup();
  }

  login(): void {
    this.authService.login(this.loginForm.value.username, this.loginForm.value.password).subscribe();
  }

  createFormGroup(): FormGroup {
    return new FormGroup({
      username: new FormControl("", [Validators.required, Validators.minLength(5)]),
      password: new FormControl("", [Validators.required, Validators.minLength(7)])
    })
  }

  
}
