import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SharedService } from '../../services/shared.service';
import { Contact } from '../../models/contact';
import { ContactApiService } from '../../services/contact-api.service';
import { ContactService } from '../../services/contact.service';

@Component({
  selector: 'app-contact-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact-overview.component.html',
  styleUrl: './contact-overview.component.scss'
})
export class ContactOverviewComponent implements OnInit, OnDestroy {
  currentContact: Contact | null = null;
  selectedContact: number | null = null;

  subscription: Subscription = new Subscription();

  constructor(
    public contactService: ContactService,
    private sharedService: SharedService,
    private cdr: ChangeDetectorRef,
    private contactApiService: ContactApiService
  ) { }


  ngOnInit(): void {
    this.subscription.add(
      this.contactService.currentContact$.subscribe(contact => {
        this.currentContact = contact;
      })
    )
  }


  ngOnDestroy(): void {
    this.contactService.resetCurrentContact();
    this.subscription.unsubscribe();
  }


  editContact() {
    this.sharedService.isPopup = true;
    this.sharedService.isEditContact = true;
  }


  async deleteContact() {
    if (this.currentContact) {
      await this.contactApiService.deleteContact(this.currentContact);
      this.contactService.loadContacts();
      this.sharedService.closeAll();
      this.sharedService.isAdding = true;
      this.sharedService.isDeleteContactText = true;
      this.cdr.detectChanges();
      requestAnimationFrame(() => {
        this.contactService.deselectContact();
      })
      setTimeout(() => {
        this.sharedService.setAllAddingTextOnFalse();
      }, 1000);
    }
  }
}
