import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { delay, filter, Subscription, tap } from 'rxjs';
import { Task } from '../../models/task.model';
import { CommonModule, DatePipe } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { SharedService } from '../../services/shared.service';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, NativeDateAdapter } from '@angular/material/core';
import { MY_DATE_FORMATS } from '../../add-task/form/form.component';
import { ClickOutsideDirective } from '../../click-outside.directive';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

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
  checkboxUrl: string = 'assets/img/check-btn/default-disable.svg';
  clickedCheckbox: boolean = false;
  task?: Task;
  taskForm: FormGroup;

  subscriptions: Subscription = new Subscription();





  contacts: User[] = [];


  constructor(
    private taskService: TaskService,
    private apiService: ApiService,
    public sharedService: SharedService,
    private fb: FormBuilder,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {
    this.taskForm = this.fb.group({});
    this.subscriptions.add(
      this.taskService.clickedTaskCard$
        .subscribe(task => {
          this.task = task;
          this.fillupTaskForm();
        })
    ),
      this.subscriptions.add(
        this.userService.users$
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
          }))


  }

  fillupTaskForm() {
    if (this.task && this.task.subtasks) {
      this.taskForm = this.fb.group({
        title: new FormControl(this.task.title, Validators.required),
        description: new FormControl(this.task.description),
        assignments: new FormControl(this.task.assignedTo),
        date: new FormControl(this.task.due_date, Validators.required),
        prio: new FormControl(this.task.prio),
        subtasks: this.fb.array(this.task.subtasks)
      })
    }
  }

  ngOnInit(): void {

  }


  ngOnDestroy(): void {
    this.taskService.resetClickedTaskCard();
    this.subscriptions.unsubscribe();
  }


  toggleCheck() {
    this.clickedCheckbox = !this.clickedCheckbox;
    this.updateCheckboxUrl();
  }


  hoverCheckbox() {
    if (this.clickedCheckbox) {
      this.checkboxUrl = 'assets/img/check-btn/hover-checked.svg';
    } else {
      this.checkboxUrl = 'assets/img/check-btn/hover-disable.svg';
    }
  }


  leaveCheckbox() {
    this.updateCheckboxUrl();
  }


  updateCheckboxUrl() {
    if (this.clickedCheckbox) {
      this.checkboxUrl = 'assets/img/check-btn/default-checked.svg';
    } else {
      this.checkboxUrl = 'assets/img/check-btn/default-disable.svg';
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

  deleteTask() {
    if (this.task) {
      this.apiService.deleteTask(this.task.id);
      this.sharedService.closeAll();
      this.cdr.detectChanges();
    }
  }

  private readonly _currentYear = new Date().getFullYear();
  readonly minDate = new Date(this._currentYear, 0, 1);
  readonly maxDate = new Date(this._currentYear + 5, 11, 31);

  openedAssignmentsList: boolean = false;
  searchAssignment: boolean = false;
  filteredContacts: User[] = [];
  isLoading: boolean = true;

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

  isWritingSubtask: boolean = false;
  isEditingSubtaskIndex: number | null = null;
  searchTextSubtasks: string = '';

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
        title: text,
        done: 'false',
        task_title: this.task?.title,
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


  deleteSavedSubtask(i: number) {
    const subtasks = this.taskForm.get('subtasks') as FormArray;
    if (subtasks) {
      subtasks.removeAt(i);
    }
    this.isEditingSubtaskIndex = null;
    this.sharedService.closeAll();
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
          title: inputValue,
          done: currentSubtaskValue.done,
          id: currentSubtaskValue.id,
          task: currentSubtaskValue.task,
          task_title: currentSubtaskValue.task_title
        });
      }
      this.isEditingSubtaskIndex = null;
    }
  }

  saveTask() {
    // updatedTask speichern
    const taskValue = {
      id: this.task?.id,
      status: this.task?.status,
      title: this.taskForm.get('title')?.value,
      description: this.taskForm.get('description')?.value,
      due_date: this.apiService.formatDateForDjango(new Date(this.taskForm.get('date')?.value)),
      prio: this.taskForm.get('prio')?.value,
      category: this.task?.category,
    }

    const subtaskValue = {
      subtasks: this.taskForm.get('subtasks')?.value,
    }



    const assignmentValue = {
      assignedTo: this.taskForm.get('assignments')?.value,
    }
    console.log(taskValue);
    console.log(subtaskValue.subtasks);
    console.log(assignmentValue.assignedTo);
    this.apiService.updateTask(taskValue, subtaskValue.subtasks, assignmentValue.assignedTo);
    this.sharedService.closeAll();

  }
}
