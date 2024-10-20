import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MAT_DATE_FORMATS, DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { NativeDateAdapter } from '@angular/material/core';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',  // Beim Parsen des Datums
  },
  display: {
    dateInput: 'DD/MM/YYYY',  // Darstellung im Inputfeld
    monthYearLabel: 'MMMM YYYY',  // Label für Monat und Jahr
    dateA11yLabel: 'DD/MM/YYYY',  // Barrierefreiheit
    monthYearA11yLabel: 'MMMM YYYY',  // Barrierefreiheit
  },
};

@Component({
  selector: 'app-form',
  standalone: true,
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    { provide: DateAdapter, useClass: NativeDateAdapter },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ],
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'

})
export class FormComponent {
  readonly date = new FormControl(new Date());
  isAssignedTo: boolean = false;
  isCategory: boolean = false;
  isHoverContact: boolean = false;
  isSubtask: boolean = false;

  private readonly _currentYear = new Date().getFullYear();
  readonly minDate = new Date(this._currentYear, 0, 1);
  readonly maxDate = new Date(this._currentYear + 5, 11, 31);

  constructor() {
  }

  onCheckboxChange(checkbox: HTMLInputElement, contactContainer: HTMLElement, isHovering: boolean) {
    const paragraph = contactContainer.querySelector('p') as HTMLElement;
    const contactIcon = contactContainer.querySelector('.contact-icon') as HTMLElement;

    if (checkbox.checked) {
      if(isHovering) {
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

  onSubmit(form: any) {
    console.log(form.value);
  }

  resetForm(form: any) {
    form.reset();
  }


  toggleAssigneTo() {
    this.isAssignedTo = !this.isAssignedTo;
    const assignedToInput = document.getElementById('assignedTo') as HTMLInputElement;
    if(assignedToInput && this.isAssignedTo) {
      assignedToInput.value = '';
    } else {
      assignedToInput.value = 'Select contacts to assign';
    }
  }

  toggleCategory() {
    this.isCategory = !this.isCategory;
  }

  writingSubtask(input: HTMLInputElement) {
    if(input.value.trim() === "") {
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
