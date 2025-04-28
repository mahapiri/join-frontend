import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Contact } from '../models/contact';

@Injectable({
  providedIn: 'root'
})
export class ContactApiService {

  apiUrl = "http://127.0.0.1:8000/api/contacts"

  private _contacts = new BehaviorSubject<Contact[]>([]);
  contacts$ = this._contacts.asObservable();

  constructor() {
    this.getAllContacts().then(datas => {
      this._contacts.next(datas);
    })
  }

  async getAllContacts() {
    try {
      const response = await fetch(`${this.apiUrl}/`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json'},
      })

      const datas = await response.json();

      if(datas) {
        return datas
      }
    } catch (error) {
      return [];
    }
  }
}
