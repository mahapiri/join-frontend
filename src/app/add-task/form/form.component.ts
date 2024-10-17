import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent {

  isAssignedTo: boolean = false;

  sendForm() {
    console.log('klappt');
  }


  toggleAssigneTo() {
    this.isAssignedTo = !this.isAssignedTo;
  }
}
