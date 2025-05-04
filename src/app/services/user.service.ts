import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  apiUrl = "http://127.0.0.1:8000/api/users"

  private _isLoggedIn = new BehaviorSubject<User | null>(null);
  isLoggedIn$ = this._isLoggedIn.asObservable();

  TOKEN: number | null = null;

  constructor() { }


  setIsLoggedIn(user: User | null) {
    this._isLoggedIn.next(user);
  }


  async registerUser(newUser: any) {
    this.deletetoken();
    try {
      const response = await fetch(`${this.apiUrl}/create/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      })

      const newCreatedUser = await response.json();
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
    this.deletetoken();
    try {
      const response = await fetch(`${this.apiUrl}/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginUser),
        credentials: 'include',
      })
      if (response.ok) {
        const newUser = await response.json();
        this.setToken(newUser['token']);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.warn('username or password is not valid:', error)
      return false
    }
  }


  setToken(token: string) {
    return localStorage.setItem('token', token);
  }


  getToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('token');
    }
    console.warn('localStorage not loaded');
    return null;
  }


  deletetoken() {
    return localStorage.removeItem('token');
  }
}
