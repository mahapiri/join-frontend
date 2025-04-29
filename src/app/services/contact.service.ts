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

  private _selectedContactId = new BehaviorSubject<number | null>(null);
  selectedContactId$ = this._selectedContactId.asObservable();

  private _currentContact = new BehaviorSubject<(Contact | null)>(null);
  currentContact$ = this._currentContact.asObservable();


  constructor(
    private contactApiService: ContactApiService
  ) { }


  async loadContacts() {
    const contacts = await this.contactApiService.getAllContacts();
    const sortedContacts = this.sortAndSetContacts(contacts);
    return sortedContacts
  }


  setNewContact(newContact: Contact) {
    const currentContacts = this._contacts.value;
    const updatedContacts = [...currentContacts, newContact];
    this.sortAndSetContacts(updatedContacts);
  }

  
  setUpdatedContact(updatedContact: Contact) {
    const currentContacts = this._contacts.value;
    const updatedId = updatedContact.id;
    const updatedContacts = currentContacts.map(contact =>
      contact.id === updatedId ? { ...contact, ...updatedContact } : contact
    );
    this.sortAndSetContacts(updatedContacts)
  }


  private sortAndSetContacts(contacts: Contact[]) {
    contacts.sort(this.sortContactsByName);
    this._contacts.next(contacts);
    return contacts
  }


  private sortContactsByName(a: Contact, b: Contact): number {
    const nameA = `${a.name}`.toLowerCase();
    const nameB = `${b.name}`.toLowerCase();
    return nameA.localeCompare(nameB);
  }


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


  saveSelectedContact(id: number | null) {
    this._selectedContactId.next(id);
  }


  deselectContact() {
    this.saveSelectedContact(null);
    this.resetCurrentContact();
  }


  resetCurrentContact() {
    this._currentContact.next(null);
  }


  findContact() {
    const contacts = this._contacts.getValue();
    const selectedContactId = this._selectedContactId.getValue();
    contacts.forEach((contact) => {
      if (contact.id === selectedContactId) {
        this._currentContact.next(contact);
      }
    })
  }
}
