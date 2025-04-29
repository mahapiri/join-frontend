import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { delay, filter, Subscription, tap } from 'rxjs';
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
export class ContactListComponent implements OnInit, OnDestroy {

  groupedContacts: { [key: string]: Contact[] } = {};
  isLoading: boolean = true;

  subscription: Subscription = new Subscription();

  constructor(
    private sharedService: SharedService,
    private contactApiService: ContactApiService,
    public contactService: ContactService
  ) { }


  ngOnInit(): void {
    this.initContact();
  }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.contactService.deselectContact();
  }


  async initContact() {
    let sortedContacts = await this.contactService.loadContacts();
    this.groupedContacts = this.groupContactsByAlphabet(sortedContacts);
    if (this.groupedContacts) this.isLoading = false;
    this.contactSubscription();
  }


  contactSubscription() {
    this.subscription = this.contactService.contacts$.subscribe(contacts => {
      this.groupedContacts = this.groupContactsByAlphabet(contacts);
    })
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


  addNewContact() {
    this.sharedService.isPopup = true;
    this.sharedService.isAddContact = true;
  }
}
