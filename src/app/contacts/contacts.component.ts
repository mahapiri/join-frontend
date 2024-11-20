import { Component, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ContactListComponent } from './contact-list/contact-list.component';
import { ContactOverviewComponent } from './contact-overview/contact-overview.component';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [ContactListComponent, ContactOverviewComponent],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})
export class ContactsComponent implements OnDestroy {
  constructor(private titleService: Title, private userService: UserService) {
    this.titleService.setTitle("Join - Contacts");
  }

  ngOnDestroy(): void {
      this.userService.selectedUser = undefined;
  }
}
