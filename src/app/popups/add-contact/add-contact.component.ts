import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SharedService } from '../../services/shared.service';
import { ValidationService } from '../../services/validation.service';
import { CommonModule } from '@angular/common';
import { ContactApiService } from '../../services/contact-api.service';
import { ContactService } from '../../services/contact.service';

@Component({
  selector: 'app-add-contact',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './add-contact.component.html',
  styleUrl: './add-contact.component.scss'
})
export class AddContactComponent {

  contactForm: FormGroup;

  constructor(
    private contactService: ContactService,
    private sharedService: SharedService,
    private validate: ValidationService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private contactApiService: ContactApiService
  ) {
    this.contactForm = this.fb.group({
      name: new FormControl('', [Validators.required, this.validate.validateName]),
      email: new FormControl('', [Validators.required, this.validate.validateEmail]),
      phone: new FormControl('', [Validators.required, this.validate.validatePhone])
    })
  }


  async onSubmit() {
    const formValue = this.contactForm.value;
    let contact = await this.contactApiService.createContact(formValue);
    this.contactService.setNewContact(contact);
    this.sharedService.closeAll();
    this.sharedService.isAdding = true;
    this.sharedService.isAddContactText = true;
    this.cdr.detectChanges();
    this.contactService.deselectContact();
    if (contact) {
      setTimeout(() => {
        this.contactService.selectContact(contact.id);
        this.sharedService.setAllAddingTextOnFalse();
        this.sharedService.setIsContactList(false);
        this.sharedService.setIsContactOverview(true);
      }, 500);
    }
  }


  cancel() {
    this.sharedService.closeAll();
  }
}
