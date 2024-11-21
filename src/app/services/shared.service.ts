import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  isPopup: boolean = false;
  isAddTask: boolean = false;
  isCard: boolean = false;
  isAdding: boolean = false;
  isAddContact: boolean = false;
  isEditContact: boolean = false;

  constructor() { }

  closeAll() {
    this.isPopup = false;
    this.isAddTask = false;
    this.isCard = false;
    this.isAdding = false;
    this.isAddContact = false;
    this.isEditContact = false;
  }
}
