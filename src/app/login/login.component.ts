import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SharedService } from '../services/shared.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ValidationService } from '../services/validation.service';
import { UserService } from '../services/user.service';

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
    private userService: UserService
  ) {
    this.loginForm = this.fb.group({
      email: new FormControl('', [Validators.required, this.validate.validateEmail]),
      password: new FormControl('', [Validators.required])
    });
    this.sharedService.setIsLoginWindow(true);
    this.userService.setIsLoggedIn(false);
  }


  passwordOnFocus(inputElement: HTMLInputElement, imgElement: HTMLImageElement) {
    this.updateIcon(inputElement, imgElement);
  }


  passwordNotOnFocus(inputElement: HTMLInputElement, imgElement: HTMLImageElement) {
    if (inputElement.value.length === 0) {
      imgElement.src = '../../assets/img/login-signup/lock.svg';
    }
  }


  togglePassword(inputElement: HTMLInputElement, imgElement: HTMLImageElement) {
    inputElement.type = inputElement.type === 'password' ? 'text' : 'password';
    this.updateIcon(inputElement, imgElement);
  }


  updateIcon(inputElement: HTMLInputElement, imgElement: HTMLImageElement) {
    if (inputElement.type === 'password') {
      imgElement.src = '../../assets/img/login-signup/visibility_off.svg';
    } else {
      imgElement.src = '../../assets/img/login-signup/visibility.svg';
    }
  }


  async onSubmit(event: Event, user: string) {
    event.preventDefault();
    if (user === 'guest') {
      this.loginForm.get('email')?.setValue('guest@pirathib-mahalingam.ch');
      this.loginForm.get('password')?.setValue('Hallo123@');
    }
  
    setTimeout(async () => {
      const loggedIn = await this.userService.loginUser(this.loginForm.value);
      if (loggedIn) {
        this.userService.setIsLoggedIn(true);
        this.router.navigate(['/summary']);
      } else this.submitted = true;
    }, 500);
  }


  register() {
    this.router.navigate(['/signup']);
  }
}
