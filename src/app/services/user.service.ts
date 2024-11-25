import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _users = new BehaviorSubject<User[]>([]);
  users$ = this._users.asObservable();

  private _selectedUser = new BehaviorSubject<string | null>('');
  selectedUser$ = this._selectedUser.asObservable();


  private _currentUser = new BehaviorSubject<(User | null)>(null);
  currentUser$ = this._currentUser.asObservable();


  constructor() {
    const users = [];
    const exampleUser1 = new User(
      {
        firstName: 'Piri',
        lastName: 'Maha',
        email: 'piri@hallo.de',
        phone: '0764334992',
      }
    );
    const exampleUser2 = new User(
      {
        firstName: 'Sara',
        lastName: 'Müller',
        email: 'sara@hallo.de',
        phone: '07645945212',
      }
    );
    users.push(exampleUser1, exampleUser2);
    users.sort(this.sortUsersByName);
    this._users.next(users);
  }


  private sortUsersByName(a: User, b: User): number {
    const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
    const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
    return nameA.localeCompare(nameB);
  }


  saveSelectedUser(userID: string) {
    let id = userID;
    this._selectedUser.next(id);
  }


  deleteContact(id: string | null) {
    const users = this._users.getValue();
    let i = 0;
    users.forEach(user => {
      i++;
      if (user.userID === id) {
        users.splice(i - 1, 1);
        this._users.next(users);
        this.saveSelectedUser('0');
        this.resetCurrentUser();
      }
    })
  }


  selectUser(userID: string) {
    const div = document.getElementById(`userID${userID}`);
    const query = document.querySelector('.select-user');
    query?.classList.remove('select-user');
    if (div) {
      div.classList.add('select-user');
      this.saveSelectedUser(userID);
      this.findUser();
    }
  }


  findUser() {
    const users = this._users.getValue();
    const selectedUser = this._selectedUser.getValue();
    users.forEach((user) => {
      if (user.userID === selectedUser) {
        this._currentUser.next(user);
      }
    })
  }

  resetCurrentUser() {
    this._currentUser.next(null);
  }


  saveUser(userID: string, firstName: string, lastName: string, mail: string, phone: string): void {
    const users = this._users.getValue();
    const userIndex = users.findIndex((user) => user.userID === userID);

    if (userIndex !== -1) {
      const updatedUser = new User({
        userID: users[userIndex].userID,
        firstName: firstName,
        lastName: lastName,
        email: mail,
        phone: phone,
        color: users[userIndex].color,
      });
      users[userIndex] = updatedUser;
      this._currentUser.next(users[userIndex]);
      this.selectUser(userID);
    }
    users.sort(this.sortUsersByName);
    this._users.next(users);

    
  }


  newUser(firstName: string, lastName: string, mail: string, phone: string) {
    const users = this._users.getValue();

    const newUser = new User({
      firstName: firstName,
      lastName: lastName,
      email: mail,
      phone: phone,
    })
    users.push(newUser);
    users.sort(this.sortUsersByName);

    this._users.next(users);

    setTimeout(() => {
      this.saveSelectedUser(newUser.userID);
      this.selectUser(newUser.userID);
    }, 1);
  }
}
