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

  private _isLoggedIn = new BehaviorSubject<boolean>(true);
  isLoggedIn$ = this._isLoggedIn.asObservable();

  constructor() { }

  setIsLoggedIn(status: boolean) {
    this._isLoggedIn.next(status);
  }
}
