import { ChangeDetectorRef, Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { SharedService } from '../../services/shared.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-contact-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact-overview.component.html',
  styleUrl: './contact-overview.component.scss'
})
export class ContactOverviewComponent {
  contacts: User[] = [];
  currentContact: User | null = null;
  selectedContact: string | null = null;

  subscription: Subscription = new Subscription();

  constructor(
    public userService: UserService, 
    private sharedService: SharedService,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) {
    this.subscription.add(
      this.userService.selectedContact$.subscribe((contact) => {
        this.selectedContact = contact;
      })
    ),
    this.subscription.add(
      this.userService.contacts$.subscribe((contacts) => {
        contacts.forEach((contact) => {
          this.contacts.push(contact);
        })
      })
    ),
    this.subscription.add(
      this.userService.currentContact$.subscribe(contact => {
        this.currentContact = contact;
      })
    )
  }


  ngOnDestroy(): void {
    this.userService.resetCurrentContact();
    this.subscription.unsubscribe();
  }


  editContact() {
    this.sharedService.isPopup = true;
    this.sharedService.isEditContact = true;
  }

  async deleteContact() {
    if (this.currentContact) {
      await this.apiService.deleteContact(this.currentContact);
      this.sharedService.closeAll();
      this.cdr.detectChanges();
      requestAnimationFrame(() => {
        this.userService.deselectContact();
      })
    }
  }
}
