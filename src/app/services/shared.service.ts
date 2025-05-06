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
  isAddCategory: boolean = false;
  isAddBoardText: boolean = false;
  isAddContactText: boolean = false;
  isDeleteContactText: boolean = false;
  isAddUserText: boolean = false;
  isAddCategoryText: boolean = false;


  private _disableAnimation = new BehaviorSubject<boolean>(false);
  disableAnimation$ = this._disableAnimation.asObservable();

  private _siteviewer = new BehaviorSubject<boolean>(false);
  siteviewer$ = this._siteviewer.asObservable();

  private _siteIsLoading = new BehaviorSubject<boolean>(true);
  siteIsLoading$ = this._siteIsLoading.asObservable();

  private _isMobileView = new BehaviorSubject<(boolean)>(false);
  isMobileView$ = this._isMobileView.asObservable();

  private _isContactList = new BehaviorSubject<(boolean)>(true);
  isContactList$ = this._isContactList.asObservable();

  private _isContactOverview = new BehaviorSubject<(boolean)>(false);
  isContactOverview$ = this._isContactOverview.asObservable();

  constructor() { }


  closeAll() {
    this.isPopup = false;
    this.isAddTask = false;
    this.isAddTaskInProgress = false;
    this.isAddTaskInAwaitFeedback = false;
    this.isCard = false;
    this.isCardEditing = false;
    this.isAddContact = false;
    this.isEditContact = false;
    this.isAddCategory = false;
  }


  setAllAddingTextOnFalse() {
    this.isAdding = false;
    this.isAddBoardText = false;
    this.isAddContactText = false;
    this.isDeleteContactText = false;
    this.isAddUserText = false;
    this.isAddCategoryText = false;
  }


  setisDisableAnimation(status: boolean) {
    this._disableAnimation.next(status);
  }


  setSiteviewer(status: boolean) {
    this._siteviewer.next(status);
  }


  siteIsLoading(status: boolean) {
    this._siteIsLoading.next(status);
  }


  setIsMobileView(status: boolean) {
    this._isMobileView.next(status);
  }


  checkViewportWidth() {
    let isMobileView = window.innerWidth < 1024;
    this.setIsMobileView(isMobileView);
  }


  setIsContactList(status: boolean) {
    this._isContactList.next(status);
  }


  setIsContactOverview(status: boolean) {
    this._isContactOverview.next(status);
  }


  resetContactView() {
    this._isContactOverview.next(false);
    this._isContactList.next(true);
  }
}
