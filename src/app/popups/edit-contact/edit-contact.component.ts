import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SharedService } from '../../services/shared.service';
import { ValidationService } from '../../services/validation.service';
import { ContactService } from '../../services/contact.service';
import { Contact } from '../../models/contact';
import { ContactApiService } from '../../services/contact-api.service';

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
export class EditContactComponent implements OnInit, OnDestroy {

  subscription: Subscription = new Subscription();

  currentContact: Contact | null = null;
  contactForm: FormGroup;

  constructor(
    public contactService: ContactService,
    public contactApiService: ContactApiService,
    private sharedService: SharedService,
    private validate: ValidationService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.contactForm = this.fb.group({
      name: new FormControl(this.currentContact?.name, [Validators.required, this.validate.validateName]),
      email: new FormControl(this.currentContact?.email, [Validators.required, this.validate.validateEmail]),
      phone: new FormControl(this.currentContact?.phone, [Validators.required, this.validate.validatePhone])
    })
  }


  ngOnInit(): void {
    this.subscription = this.contactService.currentContact$.subscribe((contact) => {
      this.currentContact = contact;
    })
    this.setValue();
  }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


  setValue() {
    this.contactForm.get('name')?.setValue(this.currentContact?.name);
    this.contactForm.get('email')?.setValue(this.currentContact?.email);
    this.contactForm.get('phone')?.setValue(this.currentContact?.phone);
  }


  async onSubmit() {
    const id = this.currentContact?.id;
    console.log(this.currentContact)
    const formValue: any = {
      'name': this.contactForm.get('name')?.value,
      'email': this.contactForm.get('email')?.value,
      'phone': this.contactForm.get('phone')?.value,
      'color': this.currentContact?.color,
      'id': this.currentContact?.id,
      'initial': this.currentContact?.initial,
      'linked_user': this.currentContact?.linked_user,
    }
    formValue['id'] = id;
    let updatedContact = await this.contactApiService.updateContact(formValue);
    this.contactService.setUpdatedContact(updatedContact);
    this.sharedService.closeAll();
    this.cdr.detectChanges();
    if (updatedContact) {
      setTimeout(() => {
        this.contactService.selectContact(updatedContact.id);
      }, 100);
    }
  }


  async deleteContact() {
    if (this.currentContact) {
      await this.contactApiService.deleteContact(this.currentContact);
      this.contactService.loadContacts();
      this.sharedService.isAdding = true;
      this.sharedService.isDeleteContactText = true;
      this.sharedService.closeAll();
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
