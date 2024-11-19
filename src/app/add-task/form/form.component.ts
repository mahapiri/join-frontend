import { CommonModule, DatePipe } from '@angular/common';
import { Component, ChangeDetectionStrategy, OnDestroy, HostListener, ElementRef } from '@angular/core';
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
  readonly date = new FormControl(new Date());
  isAssignedTo: boolean = false;
  isCategory: boolean = false;
  isHoverContact: boolean = false;
  isSubtask: boolean = false;

  private readonly _currentYear = new Date().getFullYear();
  readonly minDate = new Date(this._currentYear, 0, 1);
  readonly maxDate = new Date(this._currentYear + 5, 11, 31);

  taskServiceSubscription: Subscription = new Subscription();
  userServiceSubscription: Subscription = new Subscription();

  users: User[] = [];
  tasks: Task[] = [];
  selectedUser: User[] = [];


  clickoutside() {
    this.isAssignedTo = false;
  }

  clickOutsideCategory() {
    this.isCategory = false;
  }


  constructor(private datePipe: DatePipe, private taskService: TaskService, private userService: UserService, private eRef: ElementRef) {
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
      });
    })
  }


  ngOnDestroy(): void {
    this.taskServiceSubscription.unsubscribe();
    this.userServiceSubscription.unsubscribe();
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

  dueDate: Date | null = null;

  onSubmit(form: NgForm) {
    const dueDateValue = this.date.value;
    const formattedDate = this.datePipe.transform(dueDateValue, 'dd/MM/YYYY');
    console.log('Selected Due Date:', formattedDate);
  }

  resetForm(form: any) {
    form.reset();
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
    }
  }

  setSubtaskEdit(subtaskitem: any) {
    subtaskitem.style.opacity = "1";
  }

  setSubtaskNotEdit(subtaskitem: any) {
    subtaskitem.style.opacity = "0";
  }

}
