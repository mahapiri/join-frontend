import { CommonModule, DatePipe } from '@angular/common';
import { Component, ChangeDetectionStrategy, OnDestroy, input } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MAT_DATE_FORMATS, DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { NativeDateAdapter } from '@angular/material/core';
import { Subscription } from 'rxjs';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { ClickOutsideDirective } from '../../click-outside.directive';
import { ApiService } from '../../services/api.service';
import { SharedService } from '../../services/shared.service';
import { Router } from '@angular/router';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-form',
  standalone: true,
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    { provide: DateAdapter, useClass: NativeDateAdapter },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    DatePipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    ClickOutsideDirective
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})


export class FormComponent implements OnDestroy {
  private readonly _currentYear = new Date().getFullYear();
  readonly minDate = new Date(this._currentYear, 0, 1);
  readonly maxDate = new Date(this._currentYear + 5, 11, 31);

  allSubscription: Subscription = new Subscription();

  taskForm: FormGroup;
  contacts: User[] = [];
  filteredContacts: User[] = [];
  searchAssignment: boolean = false;
  openedAssignmentsList: boolean = false;
  openedCategoryList: boolean = false;
  searchTextSubtasks: string = '';
  isEditingSubtaskIndex: number | null = null;
  isHoverContact: boolean = false;
  isWritingSubtask: boolean = false;


  constructor(
    private userService: UserService,
    private apiService: ApiService,
    private fb: FormBuilder,
    public sharedService: SharedService,
    private router: Router
  ) {
    this.taskForm = this.fb.group({
      title: new FormControl('', Validators.required),
      description: new FormControl(''),
      assignments: new FormControl([]),
      date: new FormControl(new Date(), Validators.required),
      prio: new FormControl(null),
      category: new FormControl('', Validators.required),
      subtasks: this.fb.array([])
    })

    this.allSubscription.add(this.userService.users$.subscribe((contacts) => {
      this.contacts = [];
      this.filteredContacts = [];
      contacts.forEach(contact => {
        this.contacts.push(contact);
        this.filteredContacts.push(contact);
      });
    }))
  }


  ngOnDestroy(): void {
    this.allSubscription.unsubscribe();
  }


  selectCategory(category: string): void {
    this.taskForm.get('category')?.setValue(category);
    this.openedCategoryList = false;
  }


  clickoutsideAssignedTo() {
    let inputValue = document.getElementById('assignedTo') as HTMLInputElement;
    if (this.openedAssignmentsList) {
      this.openedAssignmentsList = false;
      inputValue.value = '';
      this.searchAssignment = false;
      
    }
  }


  clickOutsideCategory() {
    this.openedCategoryList = false;
  }


  onCheckboxChange(checkbox: HTMLInputElement, contactContainer: HTMLElement, isHovering: boolean) {
    const paragraph = contactContainer.querySelector('p') as HTMLElement;
    const contactIcon = contactContainer.querySelector('.contact-icon') as HTMLElement;
    if (checkbox.checked) {
      if (isHovering) {
        contactContainer.style.backgroundColor = 'var(--third)';
      } else {
        contactContainer.style.backgroundColor = 'var(--primary)';
      }

      if (paragraph) {
        paragraph.style.color = 'var(--white)';
        contactIcon.style.borderColor = 'var(--white)';
      }
    } else {
      contactContainer.style.backgroundColor = '';
      if (paragraph) {
        paragraph.style.color = '';
        contactIcon.style.borderColor = '';
      }
    }
  }


  async onSubmit() {
    const formValue = this.taskForm.value
    if (formValue.date) {
      formValue.date = this.apiService.formatDateForDjango(new Date(formValue.date));
    }
    await this.apiService.createNewTask(formValue);
    this.resetForm();
    this.sharedService.isAdding = true;
    setTimeout(() => {
      this.navigateToBoard();
      this.sharedService.isAdding = false;
    }, 1000);
  }

  navigateToBoard() {
    this.router.navigate(['/', 'board']);
  }


  resetForm() {
    this.taskForm.reset();
    this.uncheckCheckboxes();
    this.deleteSubtaskArray();
    this.deleteAssignmentInputField();
  }


  deleteAssignmentInputField() {
    const input = document.getElementById('assignedTo') as HTMLInputElement;
    input.value = "";
    this.searchAssignment = false;
  }

  
  uncheckCheckboxes() {
    const checkboxes = document.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
    checkboxes.forEach(checkbox => checkbox.checked = false);
  }


  openAssignedToList() {
    this.openedAssignmentsList = true
  }

  toggleAssignedTo(event: Event) {
    event.preventDefault();
    this.openedAssignmentsList = !this.openedAssignmentsList;
    const assignedToInput = document.getElementById('assignedTo') as HTMLInputElement;
    if (assignedToInput && this.openedAssignmentsList) assignedToInput.value ? '' : 'Select contacts to assign';
  }


  searchAssignments() {
    this.openAssignedToList();
    this.searchAssignment = true;
    const inputValue = document.getElementById('assignedTo') as HTMLInputElement;
    if (inputValue.value.trim().length <= 0) {
      this.searchAssignment = false;
      this.filteredContacts = [...this.contacts];
    } else {
      const searchValue = inputValue.value.trim().toUpperCase();
      this.filteredContacts = this.contacts.filter(contact =>
        contact.name.trim().toUpperCase().includes(searchValue)
      );
    }
  }

  isUserAssigned(contact: User): boolean {
    const assignments = this.taskForm.get('assignments')?.value || [];
    return assignments.some((user: User) => user.id === contact.id);
  }


  selectUser(user: User, checkbox: HTMLInputElement) {
    const assignments = this.taskForm.get('assignments') as FormControl;
    const currentAssignments: User[] = assignments.value || [];
  
    if (checkbox.checked) {
      if (!currentAssignments.some(u => u.id === user.id)) {
        assignments.setValue([...currentAssignments, user]);
      }
    } else {
      const updatedAssignments = currentAssignments.filter(u => u.id !== user.id);
      assignments.setValue(updatedAssignments);
    }
  }


  toggleCategory(event: Event) {
    event.preventDefault();
    this.openedCategoryList = !this.openedCategoryList;
  }


  writingSubtask(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.value.trim() === "") {
      this.isWritingSubtask = false;
    } else {
      this.isWritingSubtask = true;
      this.searchTextSubtasks = input.value;
    }
  }


  saveSubtask(input: HTMLInputElement) {
    if (input.value.trim().length > 0) {
      const text = this.searchTextSubtasks.trim();
      const subtasks = this.taskForm.get('subtasks') as FormArray;
      subtasks.push(new FormControl(text));
      this.searchTextSubtasks = '';
      input.value = '';
      this.isWritingSubtask = false;
    }
  }


  deleteSubtask(input: HTMLInputElement) {
    this.searchTextSubtasks = '';
    input.value = '';
  }


  setSubtaskEdit(subtaskitem: string) {
    const div = document.getElementById(subtaskitem);
    if (div) {
      div.style.opacity = '1';
    }
  }


  setSubtaskNotEdit(subtaskitem: string) {
    const div = document.getElementById(subtaskitem);
    if (div) {
      div.style.opacity = '0';
    }
  }


  deleteSavedSubtask(i: number) {
    const subtasks = this.taskForm.get('subtasks') as FormArray;
    if (subtasks) {
      subtasks.removeAt(i);
    }
    this.isEditingSubtaskIndex = null;
  }


  replaceSaveSubtask(i: number) {
    const inputElement = document.getElementById(`subtaskEdit${i}`) as HTMLInputElement;
    const subtasks = this.taskForm.get('subtasks') as FormArray;

    if (inputElement && subtasks) {
      const inputValue = inputElement.value.trim();
      if (inputValue.length > 0) {
        subtasks.at(i).setValue(inputValue);
      }
      this.isEditingSubtaskIndex = null;
    }
  }


  editSubtask(i: number): void {
    this.isEditingSubtaskIndex = i;
  }

  deleteSubtaskArray() {
    const subtasks = this.taskForm.get('subtasks') as FormArray;
    if (subtasks) {
      subtasks.clear();
    }
  }
}
