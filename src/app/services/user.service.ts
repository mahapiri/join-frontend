import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _contacts = new BehaviorSubject<User[]>([]);
  contacts$ = this._contacts.asObservable();

  private _selectedContact = new BehaviorSubject<string | null>('');
  selectedContact$ = this._selectedContact.asObservable();


  private _currentContact = new BehaviorSubject<(User | null)>(null);
  currentContact$ = this._currentContact.asObservable();


  constructor(private apiService: ApiService) {
    this.apiService.contacts$.subscribe((contact) => {
      this.sortAndSetContacts(contact);
    })

    this.apiService.getAllContacts();
  }


  private sortAndSetContacts(contacts: User[]): void {
    contacts.sort(this.sortContactsByName);
    this._contacts.next(contacts);
  }


  private sortContactsByName(a: User, b: User): number {
    const nameA = `${a.first_name} ${a.last_name}`.toLowerCase();
    const nameB = `${b.first_name} ${b.last_name}`.toLowerCase();
    return nameA.localeCompare(nameB);
  }


  selectContact(id: string) {
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


  saveSelectedContact(id: string) {
    this._selectedContact.next(id);
  }


  deselectContact() {
    this._selectedContact.next(null);
    this.saveSelectedContact('0');
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
