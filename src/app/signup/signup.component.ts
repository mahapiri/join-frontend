import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidationService } from '../services/validation.service';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './signup.component.html',
  styleUrls: [
    './../../../src/app/login/login.component.scss',
    './signup.component.scss'
  ]
})
export class SignupComponent {

  signupForm: FormGroup;

  constructor(
    private fb: FormBuilder,
        private validate: ValidationService,
        private sharedService: SharedService
  ) {
    this.signupForm = this.fb.group({
      name: new FormControl('', [Validators.required, this.validate.validateEmail]),
      email: new FormControl('', [Validators.required, this.validate.validateEmail]),
      password: new FormControl('', [Validators.required, this.validate.validatePassword]),
      confirmPassword: new FormControl('', [Validators.required, this.validate.validatePassword])
    }),
    { validators: this.validate.passwordMatchValidator() }
  }


  onSubmit() {
    if (this.signupForm.invalid) {
      console.log('Fehler im Formular');
      return;
    }
    console.log('Formulardaten:', this.signupForm.value);
  }

  back() {
    this.sharedService.isLogin = true;
    this.sharedService.isSignup = false;
    this.sharedService.setAnimation(true)
  }
}
