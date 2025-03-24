import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ApiService } from './api.service';

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


  constructor(private apiService: ApiService) {
    this.apiService.contacts$.subscribe((contact) => {
      this.sortAndSetUsers(contact);
    })

    this.apiService.getAllContacts();
  }


  private sortAndSetUsers(users: User[]): void {
    users.sort(this.sortUsersByName);
    this._users.next(users);
  }


  private sortUsersByName(a: User, b: User): number {
    const nameA = `${a.first_name} ${a.last_name}`.toLowerCase();
    const nameB = `${b.first_name} ${b.last_name}`.toLowerCase();
    return nameA.localeCompare(nameB);
  }


  saveSelectedUser(id: string) {
    this._selectedUser.next(id);
  }


  deleteContact(id: string | null) {
    const users = this._users.getValue();
    let i = 0;
    users.forEach(user => {
      i++;
      if (user.id === id) {
        users.splice(i - 1, 1);
        this._users.next(users);
        this.saveSelectedUser('0');
        this.resetCurrentUser();
      }
    })
  }


  selectUser(id: string) {
    const div = document.getElementById(`id${id}`);
    const query = document.querySelector('.select-user');
    query?.classList.remove('select-user');
    if (div) {
      div.classList.add('select-user');
      this.saveSelectedUser(id);
      this.findUser();
      div.scrollIntoView();
    }
  }


  deselectUser() {
    this._selectedUser.next(null);
  }


  findUser() {
    const users = this._users.getValue();
    const selectedUser = this._selectedUser.getValue();
    users.forEach((user) => {
      if (user.id === selectedUser) {
        this._currentUser.next(user);
      }
    })
  }

  resetCurrentUser() {
    this._currentUser.next(null);
  }


  saveUser(id: string, firstName: string, lastName: string, mail: string, phone: string): void {
    const users = this._users.getValue();
    const userIndex = users.findIndex((user) => user.id === id);

    if (userIndex !== -1) {
      const updatedUser = new User({
        id: users[userIndex].id,
        firstName: firstName,
        lastName: lastName,
        email: mail,
        phone: phone,
        color: users[userIndex].color,
      });
      users[userIndex] = updatedUser;
      this._currentUser.next(users[userIndex]);
      this.selectUser(id);
    }
    users.sort(this.sortUsersByName);
    this._users.next([...users]);

    
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
    this.sortAndSetUsers(users);

    this._users.next(users);

    setTimeout(() => {
      this.saveSelectedUser(newUser.id);
      this.selectUser(newUser.id);
    }, 1);
  }
}
