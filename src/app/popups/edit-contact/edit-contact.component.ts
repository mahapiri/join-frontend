import { Component, OnDestroy } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';
import { User } from '../../models/user.model';
import { CommonModule } from '@angular/common';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-edit-contact',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './edit-contact.component.html',
  styleUrl: './edit-contact.component.scss'
})
export class EditContactComponent implements OnDestroy{
  userServiceSubscription: Subscription = new Subscription();

  users: User[] = [];

  constructor(public userService: UserService, private sharedService: SharedService) {
    this.userService.users$.subscribe((user) => {
      user.forEach((u) => {
        this.users.push(u);
      })
    })
  }

  ngOnDestroy(): void {
      this.userServiceSubscription.unsubscribe();
  }

  save() {
    console.log('saved')
  }

  delete() {
    const index = this.userService.selectedUser;
    if(typeof index === 'number') {
      this.userService.deleteUser(index);
    }
    this.sharedService.closeAll();
  }
}
