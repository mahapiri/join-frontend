import { CommonModule, DatePipe } from '@angular/common';
import { Component, ChangeDetectionStrategy, OnDestroy, ElementRef } from '@angular/core';
import { FormControl, FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MAT_DATE_FORMATS, DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { NativeDateAdapter } from '@angular/material/core';
import { TaskService } from '../../services/task.service';
import { Subscription } from 'rxjs';
import { UserService } from '../../services/user.service';
import { Task } from '../../models/task.model';
import { User } from '../../models/user.model';
import { ClickOutsideDirective } from '../../click-outside.directive';
import { ApiService } from '../../services/api.service';

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
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, ReactiveFormsModule, ClickOutsideDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'

})
export class FormComponent implements OnDestroy {
  readonly date = new FormControl();
  isAssignedTo: boolean = false;
  isCategory: boolean = false;
  isHoverContact: boolean = false;
  isSubtask: boolean = false;

  private readonly _currentYear = new Date().getFullYear();
  readonly minDate = new Date(this._currentYear, 0, 1);
  readonly maxDate = new Date(this._currentYear + 5, 11, 31);

  taskServiceSubscription: Subscription = new Subscription();
  userServiceSubscription: Subscription = new Subscription();
  datepickerSubscription: Subscription = new Subscription();

  users: User[] = [];
  tasks: Task[] = [];
  selectedUser: User[] = [];
  subtasks: string[] = [];
  allUsers: User[] = [];
  searchTextAssigned: string = '';
  searchTextSubtasks: string = '';
  isEditingSubtaskIndex: number | null = null;

  newTask: Task = new Task({
    title: '',
    description: '',
    assignedTo: this.selectedUser,
    dueDate: this.date.value,
    prio: '',
    category: '',
    subtasks: this.subtasks,
  })

  constructor(private taskService: TaskService, private userService: UserService, private eRef: ElementRef, private apiService: ApiService) {
    this.taskServiceSubscription = this.taskService.tasks$.subscribe((tasks) => {
      this.tasks = [];
      tasks.forEach((task) => {
        this.tasks.push(task);
      })
    })

    this.userServiceSubscription = this.userService.users$.subscribe((users) => {
      this.users = [];
      users.forEach(user => {
        this.users.push(user);
        this.allUsers.push(user);
      });
    })
    this.datepickerSubscription = this.date.valueChanges.subscribe(value => {
      this.newTask.dueDate = value;
    });

    this.date.setValue(new Date());
  }


  ngOnDestroy(): void {
    this.taskServiceSubscription.unsubscribe();
    this.userServiceSubscription.unsubscribe();
    this.datepickerSubscription.unsubscribe();
  }


  selectCategory(category: string): void {
    this.newTask.category = category;
    this.isCategory = false;
  }

  clickoutside() {
    this.isAssignedTo = false;
  }

  clickOutsideCategory() {
    this.isCategory = false;
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

  onSubmit(form: NgForm) {
    console.log(this.newTask)
    if (this.newTask.dueDate !== null) {
      this.apiService.createNewTask(this.newTask);
    } else {
      console.log("Fehler");
    }
  }


  resetForm(form: NgForm) {
    this.newTask = new Task({});
    this.subtasks = [];
    this.selectedUser = [];
    form.resetForm();
    this.date.reset();

    const subtaskInput = document.getElementById('subtaskInput') as HTMLInputElement;
    if (subtaskInput) {
      subtaskInput.value = '';
    }

    const checkboxes = document.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
    checkboxes.forEach(checkbox => checkbox.checked = false);
  }


  toggleAssigneTo() {
    this.isAssignedTo = !this.isAssignedTo;
    const assignedToInput = document.getElementById('assignedTo') as HTMLInputElement;
    if (assignedToInput && this.isAssignedTo) {
      assignedToInput.value = '';
    } else {
      assignedToInput.value = 'Select contacts to assign';
    }
  }

  selectUser(user: User, checkbox: HTMLInputElement) {
    const index = this.selectedUser.findIndex(u => u.userID === user.userID);
    if (checkbox.checked) {
      this.selectedUser.push(user);
    } else {
      this.selectedUser.splice(index, 1);
    }
  }

  toggleCategory() {
    this.isCategory = !this.isCategory;
  }

  writingSubtask(input: HTMLInputElement) {
    if (input.value.trim() === "") {
      this.isSubtask = false;
    } else {
      this.isSubtask = true;
      this.searchTextSubtasks = input.value;
    }
  }

  saveSubtask(input: HTMLInputElement) {
    if (input.value.trim().length > 0) {
      const text = this.searchTextSubtasks.trim();
      this.subtasks.push(text);
      this.searchTextSubtasks = '';
      input.value = '';
      this.isSubtask = false;
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

  deletSavedSubtask(i: number) {
    this.subtasks.splice(i, 1);
    this.isEditingSubtaskIndex = null;
  }

  replaceSaveSubtask(i: number) {
    const inputElement = document.getElementById(`subtaskEdit${i}`) as HTMLInputElement;

    if (inputElement) {
      const inputValue = inputElement.value;
      this.subtasks[i] = inputValue;
      this.isEditingSubtaskIndex = null;
    }
  }


  searchKey(data: string) {
    this.searchTextAssigned = data;
    this.searchUser();
  }



  editSubtask(i: number): void {
    this.isEditingSubtaskIndex = i;
  }

  filteredUsers: User[] = [];
  searchUser() {
    if (!this.searchTextAssigned) {
      this.filteredUsers = this.users;
      return;
    }

    const searchValue = this.searchTextAssigned.toUpperCase();
    this.filteredUsers = this.users.filter(user =>
      user.name.toUpperCase().includes(searchValue)
    );
  }





}
