import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  tasks: Task[] = [
    new Task(
      {
        title: 'TestTitle',
        dueDate: '01/01/2024',
        category: 'User Story',
      }
    )
];

  constructor() { 
    
  }

  createTask(taskData: Task) {
    const newTask = new Task(taskData);
    this.tasks.push(newTask);
  }
}
