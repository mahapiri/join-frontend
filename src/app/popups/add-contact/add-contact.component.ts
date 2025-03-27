import { ChangeDetectorRef, Component, input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { SharedService } from '../../services/shared.service';
import { ValidationService } from '../../services/validation.service';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

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
    private userService: UserService,
    private apiService: ApiService,
    private sharedService: SharedService,
    private validate: ValidationService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.contactForm = this.fb.group({
      name: new FormControl('', [Validators.required, this.validate.validateName]),
      email: new FormControl('', [Validators.required, this.validate.validateEmail]),
      phone: new FormControl('', [Validators.required, this.validate.validatePhone])
    })
  }


  async onSubmit() {
    let response = await this.apiService.createContact(this.contactForm.value)
    this.sharedService.closeAll();
    this.cdr.detectChanges();
    // requestAnimationFrame(() => {


    // });


    setTimeout(() => {
      if(response) {
        this.userService.selectContact(response);
        const div = document.getElementById(`id${response}`);
        console.log(div);
      }
    }, 1000);


  }


  cancel() {
    this.sharedService.closeAll();
  }
}
