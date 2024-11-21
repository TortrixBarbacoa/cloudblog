import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup = new FormGroup({}); // Initialize directly

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
      this.signupForm = this.createFormGroup();
  }

  signUp(): void {
    if (this.signupForm.valid) {
      console.log(this.signupForm.value);
      this.authService.signUp(this.signupForm.value).subscribe(
        (msg) => console.log(msg),
        (error) => {
          console.error('Error:', error);
          // Inspect the error response here
        }
      );
    } else {
      console.error('Form is invalid');
    }
  }

  createFormGroup(): FormGroup {
    return new FormGroup({
      name: new FormControl("", [Validators.required, Validators.minLength(2)]),
      last_name: new FormControl("", [Validators.required, Validators.minLength(2)]),
      username: new FormControl("", [Validators.required, Validators.minLength(5)]),
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", [Validators.required, Validators.minLength(7)]),
      title: new FormControl("", [Validators.required]),
    })
  }

}
