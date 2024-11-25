import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-contact-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact-overview.component.html',
  styleUrl: './contact-overview.component.scss'
})
export class ContactOverviewComponent {
  users: User[] = [];
  currentUser: User | null = null;
  selectedUser: string | null = null;

  constructor(public userService: UserService, private sharedService: SharedService) {
    this.userService.selectedUser$.subscribe((user) => {
      this.selectedUser = user;
    })
    this.userService.users$.subscribe((users) => {
      users.forEach((user) => {
        this.users.push(user);
      })
    })
    this.userService.currentUser$.subscribe(user => {
      this.currentUser = user;
    })
  }


  ngOnDestroy(): void {
    this.userService.resetCurrentUser();
  }


  editContact() {
    this.sharedService.isPopup = true;
    this.sharedService.isEditContact = true;
  }
}
