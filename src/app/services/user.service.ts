import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _users = new BehaviorSubject<User[]>([]);
  users$ = this._users.asObservable();

  users: User[] = [];

  constructor() {
    const exampleUser1 = new User(
      {
        userID: '',
        firstName: 'Piri',
        lastName: 'Maha',
        email: 'piri@hallo.de',
        phone: '0764334992',
      }
    );
    const exampleUser2 = new User(
      {
        userID: '',
        firstName: 'Sara',
        lastName: 'Müller',
        email: 'sara@hallo.de',
        phone: '07645945212',
      }
    );
    this._users.next([exampleUser1, exampleUser2]);
  }
}