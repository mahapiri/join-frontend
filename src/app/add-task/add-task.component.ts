import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormComponent } from './form/form.component';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [FormComponent],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss'
})
export class AddTaskComponent {
  constructor(private titleService: Title) {
    this.titleService.setTitle("Join - Add Task");
  }
}
