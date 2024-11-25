import { Component, OnDestroy } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';
import { User } from '../../models/user.model';
import { CommonModule } from '@angular/common';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-edit-contact',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './edit-contact.component.html',
  styleUrl: './edit-contact.component.scss'
})
export class EditContactComponent implements OnDestroy {
  userServiceSubscription: Subscription = new Subscription();

  users: User[] = [];
  selectedUser: string | null = null;
  currentUser: User | null = null;

  constructor(public userService: UserService, private sharedService: SharedService) {
    this.userService.users$.subscribe((user) => {
      user.forEach((u) => {
        this.users.push(u);
      })
    })

    this.userService.selectedUser$.subscribe((user) => {
      this.selectedUser = user;
    })
  }


  ngOnDestroy(): void {
    this.userServiceSubscription.unsubscribe();
  }


  save() {
    const firstName = this.getFullname().firstName;
    const lastName = this.getFullname().lastName;
    const mail = this.getMail();
    const phone = this.getPhone();
    const index = this.selectedUser;
    if (typeof index === 'number') {
      this.userService.saveUser(index, firstName, lastName, mail, phone)
    };
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


  getMail() {
    const div = document.getElementById('mail') as HTMLInputElement;
    const mailValue = div.value;
    return mailValue;
  }


  getPhone() {
    const div = document.getElementById('phone') as HTMLInputElement;
    const phoneValue = div.value;
    return phoneValue;
  }

  
  delete() {
    this.userService.deleteContact(this.selectedUser)
    this.sharedService.closeAll();
  }
}
