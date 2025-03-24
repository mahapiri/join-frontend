import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';
import { User } from '../../models/user.model';
import { CommonModule } from '@angular/common';
import { SharedService } from '../../services/shared.service';
import { ValidationService } from '../../services/validation.service';
import { ApiService } from '../../services/api.service';

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
  subscriptions: Subscription = new Subscription();

  users: User[] = [];
  selectedUser: string | null = null;
  currentUser: User | null = null;
  contactForm: FormGroup;

  constructor(
    public userService: UserService,
    private sharedService: SharedService,
    private validate: ValidationService,
    private fb: FormBuilder,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) {

    this.subscriptions.add(
      this.userService.users$.subscribe((user) => {
        user.forEach((u) => {
          this.users.push(u);
        })
      })
    );
    this.subscriptions.add(
      this.userService.selectedUser$.subscribe((user) => {
        this.selectedUser = user;
      })
    );
    this.subscriptions.add(
      this.userService.currentUser$.subscribe((user) => {
        this.currentUser = user;
      })
    );
    this.contactForm = this.fb.group({
      name: new FormControl(this.currentUser?.name, [Validators.required, this.validate.validateName]),
      email: new FormControl(this.currentUser?.email, [Validators.required, this.validate.validateEmail]),
      phone: new FormControl(this.currentUser?.phone, [Validators.required, this.validate.validatePhone])
    })
  }


  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }


  async onSubmit() {
    if (this.currentUser) {
      let response = await this.apiService.editContact(this.contactForm.value, this.currentUser);
      this.sharedService.closeAll();
      this.cdr.detectChanges();
      requestAnimationFrame(() => {
        this.userService.selectUser(response);
      })
    }

  }


  async deleteContact() {
    if (this.currentUser) {
      await this.apiService.deleteContact(this.currentUser);
      this.sharedService.closeAll();
      this.cdr.detectChanges();
      requestAnimationFrame(() => {
        this.userService.deselectUser();
      })
    }
  }
}
