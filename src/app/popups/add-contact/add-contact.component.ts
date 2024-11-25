import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { SharedService } from '../../services/shared.service';
import { ValidationService } from '../../services/validation.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-contact',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './add-contact.component.html',
  styleUrl: './add-contact.component.scss'
})
export class AddContactComponent {
  isValidMail: boolean = true;
  isValidName: boolean = true;
  isValidPhone: boolean = true;


  constructor(private userService: UserService, private sharedService: SharedService, private validate: ValidationService) {

  }


  create() {
    const firstName = this.getFullname().firstName;
    const lastName = this.getFullname().lastName;
    const mail = this.getValidateMail();
    const phone = this.getValidatePhone();

    if(mail && phone) {
      this.userService.newUser(firstName, lastName, mail, phone);
      this.sharedService.closeAll();
    }
  }


  getValidatePhone(): string | false {
    const input = document.getElementById('phone') as HTMLInputElement;
    const phoneValue = input.value.trim();
  
    if (this.validate.validatePhone(phoneValue)) {
      this.isValidPhone = true;
      return this.validate.formatPhone(phoneValue);
    } else {
      this.isValidPhone = false;
      return false;
    }
  }
  

  getValidateMail() {
    const mail = document.getElementById('mail') as HTMLInputElement;
    const mailValue = this.validate.validateEmail(mail.value);
    if(mailValue) {
      this.isValidMail = true;
      return mail.value
    } else {
      this.isValidMail = false;
      return false;
    }
  }


  getFullname() {
    const div = document.getElementById('name') as HTMLInputElement;
    const nameValue = div.value.trim();
  
    const isValidName = this.validate.validateName(nameValue);
    if (isValidName) {
      let firstName = '';
      let lastName = '';
  
      if (nameValue.includes(' ')) {
        const split = nameValue.split(' ');
        firstName = this.capitalizeFullName(split[0]);
        lastName = this.capitalizeFullName(split.slice(1).join(' '));
      } else {
        firstName = this.capitalizeFullName(nameValue);
        lastName = '';
      }
  
      this.isValidName = true;
      return { firstName, lastName };
    } else {
      this.isValidName = false;
      return { firstName: '', lastName: '' };
    }
  }
  
  
  capitalizeFullName(name: string): string {
    return name
      .split(' ')
      .filter(word => word.trim().length > 0)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
  

  cancel() {
    this.sharedService.closeAll();
    this.isValidMail = true;
    this.isValidPhone = true;
    this.isValidName = true;
  }
}
