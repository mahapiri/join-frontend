import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';
import { User } from '../../models/user.model';
import { CommonModule } from '@angular/common';
import { SharedService } from '../../services/shared.service';
import { ValidationService } from '../../services/validation.service';
// import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-edit-contact',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './edit-contact.component.html',
  styleUrl: './edit-contact.component.scss'
})
export class EditContactComponent implements OnDestroy {
  // subscriptions: Subscription = new Subscription();

  contacts: User[] = [];
  selectedContact: string | null = null;
  currentContact: User | null = null;
  contactForm: FormGroup;

  constructor(
    public userService: UserService,
    private sharedService: SharedService,
    private validate: ValidationService,
    private fb: FormBuilder,
    // private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) {

    // this.subscriptions.add(
    //   this.userService.contacts$.subscribe((contact) => {
    //     contact.forEach((u) => {
    //       this.contacts.push(u);
    //     })
    //   })
    // );
    // this.subscriptions.add(
    //   this.userService.selectedContact$.subscribe((contact) => {
    //     this.selectedContact = contact;
    //   })
    // );
    // this.subscriptions.add(
    //   this.userService.currentContact$.subscribe((contact) => {
    //     this.currentContact = contact;
    //   })
    // );
    this.contactForm = this.fb.group({
      name: new FormControl(this.currentContact?.name, [Validators.required, this.validate.validateName]),
      email: new FormControl(this.currentContact?.email, [Validators.required, this.validate.validateEmail]),
      phone: new FormControl(this.currentContact?.phone, [Validators.required, this.validate.validatePhone])
    })
  }


  ngOnDestroy(): void {
    // this.subscriptions.unsubscribe();
  }


  async onSubmit() {
    // if (this.currentContact) {
    //   let response = await this.apiService.editContact(this.contactForm.value, this.currentContact);
    //   this.sharedService.closeAll();
    //   this.cdr.detectChanges();
    //   requestAnimationFrame(() => {
    //     this.userService.selectContact(response);
    //   })
    // }

  }


  async deleteContact() {
    if (this.currentContact) {
      // await this.apiService.deleteContact(this.currentContact);
      this.sharedService.closeAll();
      this.cdr.detectChanges();
      requestAnimationFrame(() => {
        this.userService.deselectContact();
      })
    }
  }
}
