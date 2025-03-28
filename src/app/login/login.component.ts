import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SharedService } from '../services/shared.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ValidationService } from '../services/validation.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  @ViewChild('passwordInput') passwordInput?: ElementRef;
  @ViewChild('passwordImg') passwordImg?: ElementRef;

  loginForm: FormGroup;
  submitted: boolean = false;

  constructor(
    private fb: FormBuilder,
    public sharedService: SharedService,
    private router: Router,
    private validate: ValidationService,
  ) {
    this.loginForm = this.fb.group({
      email: new FormControl('', [Validators.required, this.validate.validateEmail]),
      password: new FormControl('', [Validators.required])
    });
    this.sharedService.setIsLoginWindow(true);
  }


  passwordOnFocus() {
    this.updateIcon();
  }


  passwordNotOnFocus() {
    const imgElement = this.passwordImg?.nativeElement as HTMLImageElement;
    const inputElement = this.passwordInput?.nativeElement as HTMLInputElement;

    if (inputElement.value.length === 0) {
      imgElement.src = '../../assets/img/login-signup/lock.svg';
    }
  }


  togglePassword() {
    const inputElement = this.passwordInput?.nativeElement as HTMLInputElement;
    inputElement.type = inputElement.type === 'password' ? 'text' : 'password';
    this.updateIcon();
  }


  updateIcon() {
    const imgElement = this.passwordImg?.nativeElement as HTMLImageElement;
    const inputElement = this.passwordInput?.nativeElement as HTMLInputElement;

    if (inputElement.type === 'password') {
      imgElement.src = '../../assets/img/login-signup/visibility_off.svg';
    } else {
      imgElement.src = '../../assets/img/login-signup/visibility.svg';
    }
  }


  login(userType: string) {
    if (userType == 'guest') {
      this.router.navigate(['/summary']);
    } else if (userType == 'user') {
      this.submitted = true;
      if (this.loginForm.valid) {
        this.router.navigate(['/summary']);
      } else {
        this.loginForm.invalid;
      }
    }
  }


  register() {
    this.router.navigate(['/signup']);
  }
}
