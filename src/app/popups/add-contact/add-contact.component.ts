import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-add-contact',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './add-contact.component.html',
  styleUrl: './add-contact.component.scss'
})
export class AddContactComponent {
  constructor(private userService: UserService, private sharedService: SharedService) {

  }


  create() {
    const firstName = this.getFullname().firstName;
    const lastName = this.getFullname().lastName;
    const mail = document.getElementById('mail') as HTMLInputElement;
    const phone = document.getElementById('phone') as HTMLInputElement;

    this.userService.newUser(firstName, lastName, mail.value, phone.value);
    this.sharedService.closeAll();
  }


  getFullname() {
    const div = document.getElementById('name') as HTMLInputElement;
    const nameValue = div.value;
    const split = nameValue.split(' ');
    const firstName = split[0];
    const lastName = split.slice(-1).toString();
    return {
      firstName: firstName,
      lastName: lastName,
    }
  }


  cancel() {
    this.sharedService.closeAll();
  }
}
