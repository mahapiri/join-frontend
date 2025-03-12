import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormComponent } from './form/form.component';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [FormComponent],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss'
})
export class AddTaskComponent implements OnInit {
  constructor(private titleService: Title, private apiService: ApiService) {
    this.titleService.setTitle("Join - Add Task");
  }

  ngOnInit(): void {
  }
}
