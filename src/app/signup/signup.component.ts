import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidationService } from '../services/validation.service';
import { SharedService } from '../services/shared.service';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

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
    private sharedService: SharedService,
    private router: Router,
    private userService: UserService
  ) {
    this.signupForm = this.fb.group({
      name: new FormControl('', [Validators.required, this.validate.validateName]),
      email: new FormControl('', [Validators.required, this.validate.validateEmail]),
      password: new FormControl('', [Validators.required, this.validate.validatePassword]),
      confirmPassword: new FormControl('', [Validators.required, this.validate.validatePassword]),
      acceptPrivacy: new FormControl(false, [Validators.requiredTrue]),

    },
      { validators: this.validate.passwordMatchValidator() }
    );
  }


  async onSubmit() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }
    this.sharedService.isAdding = true;
    this.sharedService.isAddUserText = true;
    const formValue = this.signupForm.value;
    const name = this.splitName(formValue.name);
    const user = {
      "first_name": name.first_name,
      "last_name": name.last_name,
      "email": formValue.email,
      "password": formValue.password
    }
    const newCreatedUser = await this.userService.registerUser(user);
    setTimeout(() => {
      if (newCreatedUser) this.back();
      this.sharedService.setAllAddingTextOnFalse();
    }, 1000);
  }


  splitName(name: any) {
    let nameParts = name.split(' ');
    return {
      "first_name": nameParts[0],
      "last_name": nameParts.slice(1).join(' ') || ''
    }
  }


  back() {
    this.sharedService.setisDisableAnimation(true);
    this.router.navigate(['/login']);
  }


  navigateToPrivacyPolicy() {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/privacy-policy'])
    );
    window.open(url, '_blank');
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
}
