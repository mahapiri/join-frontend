import { Injectable } from '@angular/core';
import { Contact } from '../models/contact';

@Injectable({
  providedIn: 'root'
})
export class ContactApiService {

  apiUrl = "http://127.0.0.1:8000/api/contacts"

  constructor() { }


  async getAllContacts() {
    try {
      const response = await fetch(`${this.apiUrl}/`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      const contacts = await response.json();

      if (contacts) {
        return contacts
      }
    } catch (error) {
      console.warn('Error get all contacts:', error)
      return null;
    }
  }


  async createContact(newContact: Contact) {
    try {
      const response = await fetch(`${this.apiUrl}/create/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContact),
      })

      const contact = await response.json()

      if (contact) {
        return contact
      }
    } catch (error) {
      console.warn('Error create new contact:', error)
      return null
    }
  }


  async updateContact(contact: Contact) {
    try {
      const response = await fetch(`${this.apiUrl}/${contact.id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact),
      });

      const updatedContact = await response.json();

      if (updatedContact) {
        return updatedContact
      }

    } catch (error) {
      console.warn('Error update contact:', error)
      return null
    }
  }


  async deleteContact(contact: Contact) {
    try {
      await fetch(`${this.apiUrl}/${contact.id}/`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      })
    } catch (error) {
      console.warn('Error delete selected contact:', error)
    }
  }
}
