import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Contact } from '../models/contact';
import { ContactApiService } from './contact-api.service';
// import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _contacts = new BehaviorSubject<Contact[]>([]);
  contacts$ = this._contacts.asObservable();

  private _selectedContact = new BehaviorSubject<number | null>(null);
  selectedContact$ = this._selectedContact.asObservable();


  private _currentContact = new BehaviorSubject<(Contact | null)>(null);
  currentContact$ = this._currentContact.asObservable();

  private _isLoggedIn = new BehaviorSubject<boolean>(true);
  isLoggedIn$ = this._isLoggedIn.asObservable();


  constructor(
    // private apiService: ApiService,
    private contactApiService: ContactApiService
  ) {
    this.contactApiService.contacts$.subscribe((contact) => {
      this.sortAndSetContacts(contact);
    })

    this.contactApiService.getAllContacts();
  }

  setIsLoggedIn(status: boolean) {
    this._isLoggedIn.next(status);
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
}
