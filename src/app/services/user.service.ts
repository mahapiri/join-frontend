import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  apiUrl = "http://127.0.0.1:8000/api/users"

  private _isLoggedIn = new BehaviorSubject<boolean>(true);
  isLoggedIn$ = this._isLoggedIn.asObservable();

  TOKEN: number | null = null;

  constructor() { }

  setIsLoggedIn(status: boolean) {
    this._isLoggedIn.next(status);
  }

  async registerUser(newUser: any) {
    console.log(newUser)
    try {
      const response = await fetch(`${this.apiUrl}/create/`, {
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


  async loginUser(user: any) {
    const loginUser = {
      'username': user.email,
      'password': user.password
    }
    try {
      const response = await fetch(`${this.apiUrl}/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginUser),
      })
      if (response.ok) {
        const user = await response.json();
        this.TOKEN = user['token'];
        return true;
      } else {
        return false
      }
    } catch (error) {
      console.warn('username or password is not valid:', error)
      return false
    }
  }
}
