import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ContactListComponent } from './contact-list/contact-list.component';
import { ContactOverviewComponent } from './contact-overview/contact-overview.component';
import { SharedService } from '../services/shared.service';
import { CommonModule } from '@angular/common';
import { ContactService } from '../services/contact.service';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [
    ContactListComponent,
    ContactOverviewComponent,
    CommonModule
  ],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})
export class ContactsComponent implements OnInit, OnDestroy {
  isLoading: boolean = true

  constructor(
    private titleService: Title,
    public sharedService: SharedService,
    private contactService: ContactService
  ) {
    this.titleService.setTitle("Join - Contacts");
  }


  ngOnInit(): void {
    this.sharedService.checkViewportWidth();
    this.isLoading = false;
  }


  ngOnDestroy(): void {
    this.contactService.deselectContact();
    this.sharedService.resetContactView();
  }
}
