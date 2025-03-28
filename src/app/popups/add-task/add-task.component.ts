import { Component } from '@angular/core';
import { FormComponent } from '../../add-task/form/form.component';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [FormComponent],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss'
})
export class AddTaskComponent {}
