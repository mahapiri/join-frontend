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

  private _loginWindowSubject = new BehaviorSubject<boolean>(true);
  loginWindow$ = this._loginWindowSubject.asObservable();

  private _disableAnimation = new BehaviorSubject<boolean>(false);
  disableAnimation$ = this._disableAnimation.asObservable();


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


  setIsLoginWindow(status: boolean) {
    this._loginWindowSubject.next(status);
  }


  setisDisableAnimation(status: boolean) {
    this._disableAnimation.next(status);
  }
}
