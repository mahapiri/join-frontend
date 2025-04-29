import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Contact } from '../models/contact';
import { ContactApiService } from './contact-api.service';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
    private _contacts = new BehaviorSubject<Contact[]>([]);
    contacts$ = this._contacts.asObservable();


///////////


    private _selectedContact = new BehaviorSubject<number | null>(null);
    selectedContact$ = this._selectedContact.asObservable();
  
  
    private _currentContact = new BehaviorSubject<(Contact | null)>(null);
    currentContact$ = this._currentContact.asObservable();
  



//////////////


  constructor(
    private contactApiService: ContactApiService
  ) { }


  async loadContacts() {
    const contacts = await this.contactApiService.getAllContacts();
    this.sortAndSetContacts(contacts);
  }


  setNewContact(newContact: Contact) {
    const currentContacts = this._contacts.value;
    const updatedContacts = [...currentContacts, newContact];
    this.sortAndSetContacts(updatedContacts);
  }


  private sortAndSetContacts(contacts: Contact[]): void {
    contacts.sort(this.sortContactsByName);
    this._contacts.next(contacts);
  }


  private sortContactsByName(a: Contact, b: Contact): number {
    const nameA = `${a.name}`.toLowerCase();
    const nameB = `${b.name}`.toLowerCase();
    return nameA.localeCompare(nameB);
  }


////////////////

selectContact(id: number) {
  const div = document.getElementById(`id${id}`);
  const query = document.querySelector('.select-contact');
  query?.classList.remove('select-contact');
  if (div) {
    div.classList.add('select-contact');
    this.saveSelectedContact(id);
    this.findContact();
    div.scrollIntoView();
  }
}


saveSelectedContact(id: number) {
  this._selectedContact.next(id);
}


deselectContact() {
  this._selectedContact.next(null);
  this.saveSelectedContact(0);
  this.resetCurrentContact();
}


resetCurrentContact() {
  this._currentContact.next(null);
}


findContact() {
  const contacts = this._contacts.getValue();
  const selectedContact = this._selectedContact.getValue();
  contacts.forEach((contact) => {
    if (contact.id === selectedContact) {
      this._currentContact.next(contact);
    }
  })
}

////////////////
}
