import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _isLoggedIn = new BehaviorSubject<boolean>(true);
  isLoggedIn$ = this._isLoggedIn.asObservable();

  constructor() { }

  setIsLoggedIn(status: boolean) {
    this._isLoggedIn.next(status);
  }
}
