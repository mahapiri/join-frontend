import { ChangeDetectorRef, Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { SharedService } from '../../services/shared.service';
import { Contact } from '../../models/contact';
import { ContactApiService } from '../../services/contact-api.service';
import { ContactService } from '../../services/contact.service';
// import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-contact-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact-overview.component.html',
  styleUrl: './contact-overview.component.scss'
})
export class ContactOverviewComponent {
  contacts: Contact[] = [];
  currentContact: Contact | null = null;
  selectedContact: number | null = null;

  subscription: Subscription = new Subscription();

  constructor(
    public contactService: ContactService, 
    private sharedService: SharedService,
    // private apiService: ApiService,
    private cdr: ChangeDetectorRef,
    private contactApiService: ContactApiService
  ) {
    this.subscription.add(
      this.contactService.selectedContact$.subscribe((contact) => {
        this.selectedContact = contact;
      })
    ),
    this.subscription.add(
      this.contactService.contacts$.subscribe((contacts) => {
        contacts.forEach((contact) => {
          this.contacts.push(contact);
        })
      })
    ),
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
      this.sharedService.closeAll();
      this.cdr.detectChanges();
      requestAnimationFrame(() => {
        this.contactService.deselectContact();
      })
    }
  }
}
