import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { delay, filter, tap } from 'rxjs';
import { SharedService } from '../../services/shared.service';
import { ContactApiService } from '../../services/contact-api.service';
import { Contact } from '../../models/contact';
import { UserService } from '../../services/user.service';
import { ContactService } from '../../services/contact.service';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.scss'
})
export class ContactListComponent implements OnDestroy {

  groupedContacts: { [key: string]: Contact[] } = {};
  isLoading: boolean = true;

  constructor(
    private sharedService: SharedService,
    private contactApiService: ContactApiService,
    public contactService: ContactService
  ) {
    this.isLoading = true;
    this.contactService.contacts$
    .pipe(
      delay(500),
      filter(contacts => contacts && contacts.length > 0),
      tap(() => this.isLoading = false)
    )
    .subscribe(contacts => {
      this.groupedContacts = this.groupContactsByAlphabet(contacts);
    });
  }

  groupContactsByAlphabet(contacts: Contact[]): { [key: string]: Contact[] } {
    return contacts.reduce((groups: { [key: string]: Contact[] }, contact: Contact) => {
      const initial = contact.name.charAt(0).toUpperCase();
      if (!groups[initial]) {
        groups[initial] = [];
      }
      groups[initial].push(contact);
      return groups;
    }, {});
  }

  ngOnDestroy(): void {
    this.contactService.deselectContact();
  }

  addNewContact() {
    this.sharedService.isPopup = true;
    this.sharedService.isAddContact = true;
  }
}
