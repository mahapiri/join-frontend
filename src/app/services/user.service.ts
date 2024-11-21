import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _users = new BehaviorSubject<User[]>([]);
  users$ = this._users.asObservable();

  isSelected: boolean = false;
  selectedUser: number | undefined = undefined;

  constructor() {
    const exampleUser1 = new User(
      {
        userID: '12235464',
        firstName: 'Piri',
        lastName: 'Maha',
        email: 'piri@hallo.de',
        phone: '0764334992',
      }
    );
    const exampleUser2 = new User(
      {
        userID: '546465631',
        firstName: 'Sara',
        lastName: 'Müller',
        email: 'sara@hallo.de',
        phone: '07645945212',
      }
    );
    this._users.next([exampleUser1, exampleUser2]);
  }

  selectUser(i: number): void {
    const div = document.getElementById(`userID${i}`);
    const query = document.querySelector('.select-user');
    query?.classList.remove('select-user');
    if (div) {
      div.classList.add('select-user');
      this.selectedUser = i;
    }
  }

  deleteUser(index: number): void {
    const users = this._users.getValue();
    if(index >= 0 && index < users.length) {
      users.splice(index, 1);
      this._users.next(users);
    }
    this.selectedUser = undefined;
  }
}
