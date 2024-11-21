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

  constructor(public userService: UserService, private sharedService: SharedService) {

  }

  ngOnDestroy(): void {
  }

  editContact() {
    this.sharedService.isPopup = true;
    this.sharedService.isEditContact = true;
  }

  deleteContact() {
    const index = this.userService.selectedUser;
    if(typeof index === 'number') {
      this.userService.deleteUser(index);
    }
    this.sharedService.closeAll();
  }
}
