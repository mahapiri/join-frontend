import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.scss'
})
export class ContactListComponent implements OnDestroy {

  constructor(public userService: UserService, private sharedService: SharedService) {
  }

  ngOnDestroy(): void {
  }

  addNewContact() {
    this.sharedService.isPopup = true;
    this.sharedService.isAddContact = true;
  }
}
