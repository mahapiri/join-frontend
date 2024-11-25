import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.scss'
})
export class ContactListComponent implements OnDestroy {

  groupedUsers: { [key: string]: User[] } = {};

  constructor(public userService: UserService, private sharedService: SharedService) {
    this.userService.users$.subscribe(users => {
      this.groupedUsers = this.groupUsersByAlphabet(users);
      
    });
  }

  groupUsersByAlphabet(users: User[]): { [key: string]: User[] } {
    return users.reduce((groups: { [key: string]: User[] }, user: User) => {
      const initial = user.name.charAt(0).toUpperCase();
      if (!groups[initial]) {
        groups[initial] = [];
      }
      groups[initial].push(user);
      return groups;
    }, {});
  }

  ngOnDestroy(): void {
  }

  addNewContact() {
    this.sharedService.isPopup = true;
    this.sharedService.isAddContact = true;
  }
}
