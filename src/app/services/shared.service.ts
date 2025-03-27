import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  isPopup: boolean = false;
  isAddTask: boolean = false;
  isAddTaskInProgress: boolean = false;
  isAddTaskInAwaitFeedback: boolean = false;
  isCard: boolean = false;
  isCardEditing: boolean = false;
  isAdding: boolean = false;
  isAddContact: boolean = false;
  isEditContact: boolean = false;

  private searchTermSubject = new BehaviorSubject<string>('');
  searchTerm$ = this.searchTermSubject.asObservable();

  private isSearchingTerm = new BehaviorSubject<boolean>(false);
  isSearching$ = this.isSearchingTerm.asObservable();

  constructor() { }

  closeAll() {
    this.isPopup = false;
    this.isAddTask = false;
    this.isAddTaskInProgress = false;
    this.isAddTaskInAwaitFeedback = false;
    this.isCard = false;
    this.isCardEditing = false;
    this.isAdding = false;
    this.isAddContact = false;
    this.isEditContact = false;
  }

  setSearchTerm(searchTerm: string) {
    this.searchTermSubject.next(searchTerm);
  }

  setIsSearchingTerm(isSearching: boolean) {
    this.isSearchingTerm.next(isSearching);
  }
}
