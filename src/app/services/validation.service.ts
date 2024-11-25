import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor() { }


  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }


  validatePhone(phone: string): boolean {
    const phoneRegex = /^\+?[0-9 ]+$/; 
    const minDigits = 7;
    const maxDigits = 15;
  
    const digitCount = phone.replace(/\D/g, "").length;
  
    return phoneRegex.test(phone) && digitCount >= minDigits && digitCount <= maxDigits;
  }
  


  validateName(name: string): boolean {
    const nameRegex = /^[a-zA-ZäöüßÄÖÜ ]+$/;
    return name.trim().length > 0 && nameRegex.test(name);
  }


  formatPhone(phone: string): string {
    return phone.replace(/\s+/g, "");
  }
}
