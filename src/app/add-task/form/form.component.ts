import { CommonModule, DatePipe } from '@angular/common';
import { Component, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef, ElementRef, ViewChild, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MAT_DATE_FORMATS, DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { NativeDateAdapter } from '@angular/material/core';
import { ClickOutsideDirective } from '../../click-outside.directive';
import { SharedService } from '../../services/shared.service';
import { Router } from '@angular/router';
import { Contact } from '../../models/contact';
import { delay, filter, Subscription, tap } from 'rxjs';
import { TaskApiService } from '../../services/task-api.service';
import { Category } from '../../models/category';
import { TaskService } from '../../services/task.service';
import { ContactService } from '../../services/contact.service';

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
  styleUrls: [
    './form.component.scss',
    './formstyle.component.scss'
  ]
})


export class FormComponent implements OnInit, OnDestroy {
  private readonly _currentYear = new Date().getFullYear();
  readonly minDate = new Date(this._currentYear, 0, 1);
  readonly maxDate = new Date(this._currentYear + 5, 11, 31);

  allSubscription: Subscription = new Subscription();

  taskForm: FormGroup;
  contacts: Contact[] = [];
  filteredContacts: Contact[] = [];
  isHoverContact: boolean = false;
  searchAssignment: boolean = false;
  openedAssignmentsList: boolean = false;
  categories: Category[] = [];
  openedCategoryList: boolean = false;
  searchTextSubtasks: string = '';
  isEditingSubtaskIndex: number | null = null;
  isWritingSubtask: boolean = false;
  isContactLoading: boolean = true;
  contactsFound: boolean = true;
  isCategoryLoading: boolean = true;
  categoriesFound: boolean = true;


  @ViewChild('assignedToInput') assignedToInput!: ElementRef<HTMLInputElement>


  constructor(
    private fb: FormBuilder,
    public sharedService: SharedService,
    private router: Router,
    private contactService: ContactService,
    private taskApiService: TaskApiService,
    private taskService: TaskService,
    private cdr: ChangeDetectorRef,
  ) {
    this.taskForm = this.fb.group({
      title: new FormControl('', Validators.required),
      description: new FormControl(''),
      assigned_contacts: new FormControl([]),
      due_date: new FormControl(new Date(), Validators.required),
      prio: new FormControl(null),
      category: new FormControl<Category | null>(null, Validators.required),
      subtasks: this.fb.array([])
    });
  }


  ngOnInit(): void {
    this.isContactLoading = true;
    this.isCategoryLoading = true;
    this.categoriesFound = true;
    this.setContacts();
    this.setCategories();
  }


  setContacts() {
    this.contactService.loadContacts();
    this.allSubscription.add(
      this.contactService.contacts$.pipe(
        delay(500),
        tap(() => this.isContactLoading = false)
      ).subscribe((contacts) => {
        this.contacts = [];
        this.filteredContacts = [];
        if (contacts.length < 1) this.contactsFound = false;
        contacts.forEach(contact => {
          this.contacts.push(contact);
          this.filteredContacts.push(contact);
        });
        this.cdr.detectChanges();
      })
    );
  }


  setCategories() {
    this.taskService.loadCategories();
    this.allSubscription.add(
      this.taskService.categories$.pipe(
        delay(500),
        tap(() => this.isCategoryLoading = false),
      ).subscribe(categories => {
        if (categories.length < 1) this.categoriesFound = false;
        this.categories = categories;
      })
    );
  }


  ngOnDestroy(): void {
    this.allSubscription.unsubscribe();
  }


  clickoutsideAssignedTo() {
    if (this.openedAssignmentsList) {
      this.openedAssignmentsList = false;
      this.assignedToInput.nativeElement.value = '';
      this.searchAssignment = false;
    }
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


  deleteAssignmentInputField() {
    this.assignedToInput.nativeElement.value = '';
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
    if (this.assignedToInput && this.openedAssignmentsList) this.assignedToInput.nativeElement.value ? '' : 'Select contacts to assign';
  }


  searchAssignments() {
    this.openAssignedToList();
    this.searchAssignment = true;
    if (this.assignedToInput.nativeElement.value.trim().length <= 0) {
      this.searchAssignment = false;
      this.filteredContacts = [...this.contacts];
    } else {
      const searchValue = this.assignedToInput.nativeElement.value.trim().toUpperCase();
      this.filteredContacts = this.contacts.filter(contact =>
        contact.name.trim().toUpperCase().includes(searchValue)
      );
    }
  }


  isContactAssigned(contact: Contact): boolean {
    const assignments = this.taskForm.get('assigned_contacts')?.value || [];
    return assignments.some((thisContact: Contact) => thisContact.id === contact.id);
  }


  selectContact(contact: Contact, checkbox: HTMLInputElement) {
    const assignments = this.taskForm.get('assigned_contacts') as FormControl;
    const currentAssignments: Contact[] = assignments.value || [];

    if (checkbox.checked) {
      if (!currentAssignments.some(u => u.id === contact.id)) {
        assignments.setValue([...currentAssignments, contact]);
      }
    } else {
      const updatedAssignments = currentAssignments.filter(u => u.id !== contact.id);
      assignments.setValue(updatedAssignments);
    }
  }


  selectCategory(category: Category): void {
    this.taskForm.get('category')?.setValue(category);
    this.openedCategoryList = false;
  }


  clickOutsideCategory() {
    this.openedCategoryList = false;
  }


  toggleCategory(event: Event) {
    event.preventDefault();
    this.openedCategoryList = !this.openedCategoryList;
  }


  addNewCategory() {
    this.sharedService.isPopup = true;
    this.sharedService.isAddCategory = true;
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
      const subtaskObject = this.fb.group({
        subtask: [text, Validators.required],
        is_completed: false
      })
      subtasks.push(subtaskObject);
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
        const subtaskGroup = subtasks.at(i) as FormGroup;
        subtaskGroup.patchValue({
          subtask: inputValue
        });
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


  async onSubmit() {
    const formValue = this.taskForm.value;
    if (formValue.due_date) formValue.due_date = this.taskApiService.formatDateForDjango(new Date(formValue.due_date));
    const status = this.sharedService.isAddTaskInProgress ? 'in_progress' :
      this.sharedService.isAddTaskInAwaitFeedback ? 'await_feedback' : 'to_do';
    const newTask = await this.taskApiService.createNewTask(formValue, status);
    if (newTask) this.taskService.setNewTask(newTask);
    this.resetForm();
    this.sharedService.isAdding = true;
    this.sharedService.isAddBoardText = true;
    setTimeout(() => {
      this.navigateToBoard();
      this.sharedService.closeAll();
      this.sharedService.setAllAddingTextOnFalse();
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
}
