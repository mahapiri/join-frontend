import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  apiUrl = "http://127.0.0.1:8000/api/contacts"

  private _isLoggedIn = new BehaviorSubject<boolean>(true);
  isLoggedIn$ = this._isLoggedIn.asObservable();

  constructor() { }

  setIsLoggedIn(status: boolean) {
    this._isLoggedIn.next(status);
  }

  async createUser(newUser: any) {
    console.log(newUser)
    try {
      const response = await fetch(`${this.apiUrl}/create/user/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      })

      const newCreatedUser = await response.json();
      console.log(newCreatedUser)
      if (newCreatedUser) return newCreatedUser
    } catch (error) {
      console.warn('Error create new user:', error)
      return null;
    }
  }
}
