import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { delay, filter, Subscription, tap } from 'rxjs';
import { Subtask, Task } from '../../models/task.model';
import { CommonModule, DatePipe } from '@angular/common';
// import { ApiService } from '../../services/api.service';
import { SharedService } from '../../services/shared.service';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, NativeDateAdapter } from '@angular/material/core';
import { MY_DATE_FORMATS } from '../../add-task/form/form.component';
import { ClickOutsideDirective } from '../../click-outside.directive';
import { UserService } from '../../services/user.service';
import { Contact } from '../../models/contact';
import { ContactService } from '../../services/contact.service';
import { TaskApiService } from '../../services/task-api.service';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    ClickOutsideDirective
  ],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    { provide: DateAdapter, useClass: NativeDateAdapter },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    DatePipe
  ],
  templateUrl: './card.component.html',
  styleUrls: [
    './../../../../src/app/add-task/form/formstyle.component.scss',
    './card.component.scss'
  ]
})
export class CardComponent implements OnDestroy, OnInit {
  task?: Task;
  taskForm: FormGroup;

  subscriptions: Subscription = new Subscription();
  contacts: Contact[] = [];

  private readonly _currentYear = new Date().getFullYear();
  readonly minDate = new Date(this._currentYear, 0, 1);
  readonly maxDate = new Date(this._currentYear + 5, 11, 31);

  openedAssignmentsList: boolean = false;
  searchAssignment: boolean = false;
  filteredContacts: Contact[] = [];
  isLoading: boolean = true;

  isWritingSubtask: boolean = false;
  isEditingSubtaskIndex: number | null = null;
  searchTextSubtasks: string = '';

  constructor(
    private taskService: TaskService,
    private taskApiService: TaskApiService,
    public sharedService: SharedService,
    private fb: FormBuilder,
    private contactService: ContactService,
    private cdr: ChangeDetectorRef
  ) {
    this.taskForm = this.fb.group({});
  }


  fillupTaskForm() {
    if (this.task) {
      this.taskForm = this.fb.group({
        title: new FormControl(this.task.title, Validators.required),
        description: new FormControl(this.task.description),
        assigned_contacts: new FormControl(this.task.assigned_contacts || []),
        due_date: new FormControl(this.task.due_date, Validators.required),
        prio: new FormControl(this.task.prio),
        subtasks: this.fb.array(this.task.subtasks || [])
      })
    }
  }


  clickTaskSubscription() {
    this.subscriptions.add(
      this.taskService.clickedTaskCard$
        .subscribe(task => {
          this.task = task;
          this.fillupTaskForm();
        })
    )
  }


  contactSubscription() {
    this.subscriptions.add(
      this.contactService.contacts$
        .pipe(
          delay(500),
          filter(contacts => contacts && contacts.length > 0),
          tap(() => this.isLoading = false)
        )
        .subscribe((contacts) => {
          this.contacts = [];
          this.filteredContacts = [];
          contacts.forEach(contact => {
            this.contacts.push(contact);
            this.filteredContacts.push(contact);
          });
          this.cdr.detectChanges();
        })
    )
  }


  ngOnInit(): void {
    this.clickTaskSubscription();
    this.contactSubscription();
    this.contactService.loadContacts();
  }


  ngOnDestroy(): void {
    this.taskService.resetClickedTaskCard();
    this.subscriptions.unsubscribe();
  }


  async toggleCheck(i: number) {
    if (this.task?.subtasks) {
      this.task.subtasks[i].is_completed = !this.task.subtasks[i].is_completed;
      this.updateCheckboxUrl(i);
      await this.taskApiService.updateTask(this.task);
      this.taskService.loadTasks();
      this.cdr.detectChanges();
    }
  }


  hoverCheckbox(i: number) {
    const checkbox = document.getElementById(`subtask${i}`) as HTMLImageElement;
    if (this.task?.subtasks && !this.task.subtasks[i].is_completed) {
      checkbox.src = 'assets/img/check-btn/hover-disable.svg';
    } else {
      checkbox.src = 'assets/img/check-btn/hover-checked.svg';
    }
  }


  leaveCheckbox(i: number) {
    this.updateCheckboxUrl(i);
  }


  updateCheckboxUrl(i: number) {
    const checkbox = document.getElementById(`subtask${i}`) as HTMLImageElement;
    if (this.task?.subtasks) {
      checkbox.src = this.task.subtasks[i].is_completed ?
        'assets/img/check-btn/default-checked.svg' :
        'assets/img/check-btn/default-disable.svg';
    }

  }


  setDateFormat(date: any) {
    let splitValues = date.split("-");
    return `${splitValues[2]}/${splitValues[1]}/${splitValues[0]}`
  }


  updatePrio(prio: any) {
    switch (prio) {
      case 'low':
        return 'Low'
      case 'medium':
        return 'Medium'
      case 'urgent':
        return 'Urgent'
      default:
        return ''
    }
  }


  editTask() {
    this.sharedService.isCard = true;
    this.sharedService.isCardEditing = true;
  }


  async deleteTask() {
    if (this.task) {
      await this.taskApiService.deleteTask(this.task);
      this.taskService.loadTasks();
      this.sharedService.closeAll();
      this.cdr.detectChanges();
    }
  }


  clickoutsideAssignedTo() {
    let inputValue = document.getElementById('assignedTo') as HTMLInputElement;
    if (this.openedAssignmentsList) {
      this.openedAssignmentsList = false;
      inputValue.value = '';
      this.searchAssignment = false;
    }
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
      subtasks.push(new FormControl({
        subtask: text,
        done: 'false',
        task: this.task?.id
      }));
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


  editSubtask(i: number): void {
    this.isEditingSubtaskIndex = i;
  }


  deleteSavedSubtask(i: number, subtask: Subtask) {
    const subtasks = this.taskForm.get('subtasks') as FormArray;
    if (subtasks && this.task) {
      subtasks.removeAt(i);
      if (subtask.id) this.taskApiService.deleteSubtask(subtask.id);
      this.taskService.loadTasks();
    }
    this.isEditingSubtaskIndex = null;
    this.cdr.detectChanges();
  }


  replaceSaveSubtask(i: number) {
    const inputElement = document.getElementById(`subtaskEdit${i}`) as HTMLInputElement;
    const subtasks = this.taskForm.get('subtasks') as FormArray;

    if (inputElement && subtasks) {
      const inputValue = inputElement.value.trim();
      if (inputValue.length > 0) {
        console.log(subtasks)
        const subtaskControl = subtasks.at(i) as FormGroup;

        const currentSubtaskValue = subtaskControl.value;
        subtaskControl.patchValue({
          subtask: inputValue,
          is_completed: currentSubtaskValue.is_completed,
          id: currentSubtaskValue.id,
          task: currentSubtaskValue.task,
        });
      }
      this.isEditingSubtaskIndex = null;
    }
  }


  async saveTask() {
    if (this.task) {
      this.task.title = this.taskForm.get('title')?.value;
      this.task.description = this.taskForm.get('description')?.value;
      this.task.due_date = this.taskForm.get('due_date')?.value;
      this.task.prio = this.taskForm.get('prio')?.value;
      this.task.assigned_contacts = this.taskForm.get('assigned_contacts')?.value;
      this.task.subtasks = this.taskForm.get('subtasks')?.value;
    }
    const formValue = this.task;
    if (formValue) {
      const updatedTask = await this.taskApiService.updateTask(formValue);
      if (updatedTask) this.sharedService.closeAll();
      this.taskService.loadTasks();
    }
  }
}