import { ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SharedService } from '../../services/shared.service';
import { Contact } from '../../models/contact';
import { ContactApiService } from '../../services/contact-api.service';
import { ContactService } from '../../services/contact.service';
import { ClickOutsideDirective } from '../../click-outside.directive';

@Component({
  selector: 'app-contact-overview',
  standalone: true,
  imports: [
    CommonModule,
    ClickOutsideDirective,
  ],
  templateUrl: './contact-overview.component.html',
  styleUrls: [
    './contact-overview.component.scss',
    './contact-overview-responsive.component.scss'
  ]
})
export class ContactOverviewComponent implements OnInit, OnDestroy {
  currentContact: Contact | null = null;
  selectedContact: number | null = null;
  isOption: boolean = false;

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
        this.sharedService.resetContactView();
      }, 1000);
    }
  }

  
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.sharedService.checkViewportWidth();
  }


  toggleOptions() {
    this.isOption = !this.isOption;
  }


  back() {
    this.sharedService.resetContactView();
    this.contactService.deselectContact();
  }
}
