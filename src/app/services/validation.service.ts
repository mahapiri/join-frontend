import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor() { }


  validatePassword(control: AbstractControl): ValidationErrors | null {
    const passwordRegex = /^(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?/~\-]).{8,}$/;
    
    if (!control.value) {
      return null;
    }
  
    return passwordRegex.test(control.value) ? null : { invalidPassword: true };
  }

  passwordMatchValidator(): ValidatorFn {
    return (form: AbstractControl): ValidationErrors | null => {
      const group = form as FormGroup;
      const password = group.get('password')?.value;
      const confirmPassword = group.get('confirmPassword')?.value;
      return password === confirmPassword ? null : { passwordMismatch: true };
    };
  }


  validateEmail(control: AbstractControl): ValidationErrors | null {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!control.value) {
      return null;
    }
  
    return emailRegex.test(control.value) ? null : { invalidEmail: true };
  }
  

  validatePhone(control: AbstractControl): ValidationErrors | null {
    const phoneRegex = /^\+?[0-9 ]+$/;
    const minDigits = 7;
    const maxDigits = 15;
  
    if (!control.value) {
      return null;
    }
  
    const digitCount = control.value.replace(/\D/g, "").length;
  
    if (!phoneRegex.test(control.value) || digitCount < minDigits || digitCount > maxDigits) {
      return { invalidPhone: true };
    }
  
    return null;
  }
  

  validateName(control: AbstractControl): ValidationErrors | null {
    const nameRegex = /^[a-zA-ZäöüßÄÖÜ ]+$/;
    
    if (!control.value || control.value.trim().length === 0) {
      return { required: true };
    }
  
    return nameRegex.test(control.value) ? null : { invalidName: true };
  }


  validateCategory(control: AbstractControl): ValidationErrors | null {
    const categoryRegex = /([a-zA-Z0-9\s]+)/;

    if(!control.value || control.value.trim().length === 0) {
      return { required: true };
    }

    return categoryRegex.test(control.value) ? null : { invalidName: true };
  }


  formatPhone(phone: string): string {
    return phone.replace(/\s+/g, "");
  }
}
