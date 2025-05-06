import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedService } from '../../services/shared.service';
import { ContactApiService } from '../../services/contact-api.service';
import { Contact } from '../../models/contact';
import { ContactService } from '../../services/contact.service';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact-list.component.html',
  styleUrls: [
    './contact-list.component.scss',
    './constact-list-responsive.component.scss',
  ]
})
export class ContactListComponent implements OnInit, OnDestroy {
  groupedContacts: { [key: string]: Contact[] } = {};
  isLoading: boolean = true;

  subscription: Subscription = new Subscription();

  constructor(
    private sharedService: SharedService,
    public contactService: ContactService
  ) { }


  ngOnInit(): void {
    this.initContact();
    this.sharedService.checkViewportWidth();
  }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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


  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.sharedService.checkViewportWidth();
  }


  selectContact(id: number) {
    this.contactService.selectContact(id);
    this.sharedService.setIsContactList(false);
    this.sharedService.setIsContactOverview(true);
  }
}
