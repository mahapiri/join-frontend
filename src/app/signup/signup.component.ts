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
      name: new FormControl('', [Validators.required, this.validate.validateEmail]),
      email: new FormControl('', [Validators.required, this.validate.validateEmail]),
      password: new FormControl('', [Validators.required, this.validate.validatePassword]),
      confirmPassword: new FormControl('', [Validators.required, this.validate.validatePassword])
    }),
      { validators: this.validate.passwordMatchValidator() };
    this.sharedService.setIsLoginWindow(true);
    this.sharedService.setisDisableAnimation(true);
    this.userService.setIsLoggedIn(false);
  }


  onSubmit() {
    if (this.signupForm.invalid) {
      console.log('Fehler im Formular');
      return;
    }
    console.log('Formulardaten:', this.signupForm.value);
  }

  back() {
    this.sharedService.setisDisableAnimation(true);
    this.router.navigate(['/login']);
  }

  navigateToPrivacyPolicy() {
    this.router.navigate(['/privacy-policy']);
  }

  isContactAssigned() {
    // const assignments = this.taskForm.get('assignments')?.value || [];
    // return assignments.some((thisContact: User) => thisContact.id === contact.id);
  }

  onCheckboxChange() {
    //   const paragraph = contactContainer.querySelector('p') as HTMLElement;
    //   const contactIcon = contactContainer.querySelector('.contact-icon') as HTMLElement;
    //   if (checkbox.checked) {
    //     if (isHovering) {
    //       contactContainer.style.backgroundColor = 'var(--third)';
    //     } else {
    //       contactContainer.style.backgroundColor = 'var(--primary)';
    //     }

    //     if (paragraph) {
    //       paragraph.style.color = 'var(--white)';
    //       contactIcon.style.borderColor = 'var(--white)';
    //     }
    //   } else {
    //     contactContainer.style.backgroundColor = '';
    //     if (paragraph) {
    //       paragraph.style.color = '';
    //       contactIcon.style.borderColor = '';
    //     }
    //   }
    // }
  }
}
