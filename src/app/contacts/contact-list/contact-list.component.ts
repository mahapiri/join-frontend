import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { delay, filter, tap } from 'rxjs';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.scss'
})
export class ContactListComponent implements OnDestroy {

  groupedContacts: { [key: string]: User[] } = {};
  isLoading: boolean = true;

  constructor(public userService: UserService, private sharedService: SharedService) {
    this.isLoading = true;
    this.userService.contacts$
    .pipe(
      delay(500),
      filter(tasks => tasks && tasks.length > 0),
      tap(() => this.isLoading = false)
    )
    .subscribe(contacts => {
      this.groupedContacts = this.groupContactsByAlphabet(contacts);
    });
  }

  groupContactsByAlphabet(contacts: User[]): { [key: string]: User[] } {
    return contacts.reduce((groups: { [key: string]: User[] }, contact: User) => {
      const initial = contact.name.charAt(0).toUpperCase();
      if (!groups[initial]) {
        groups[initial] = [];
      }
      groups[initial].push(contact);
      return groups;
    }, {});
  }

  ngOnDestroy(): void {
    this.userService.deselectContact();
  }

  addNewContact() {
    this.sharedService.isPopup = true;
    this.sharedService.isAddContact = true;
  }
}
