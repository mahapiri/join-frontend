import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  task: Task = new Task({

  });

  constructor() { 
    
  }
}
