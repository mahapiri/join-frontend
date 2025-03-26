import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  tasks: Task[] = [];

  tasksToDo: number = 0;
  tasksInProgress: number = 0;
  awaitingFeedback: number = 0;
  tasksDone: number = 0;
  totalTasks: number = 0;
  urgent: number = 0;
  upComingDeadline: string = '-';

  private _clickedTaskCardSubject = new BehaviorSubject<any>(Task);
  clickedTaskCard$ = this._clickedTaskCardSubject.asObservable();

  constructor() {
  }

  updateClickedTaskCard(task: Task) {
    this._clickedTaskCardSubject.next(task);
  }

  resetClickedTaskCard() {
    this._clickedTaskCardSubject.next(null);
  }


  updateValues(tasks: Task[]) {
    tasks = tasks.map(task => new Task(task));

    this.tasksToDo = tasks.filter(task => task.status === 'to_do').length;
    this.tasksInProgress = tasks.filter(task => task.status === 'in_progress').length;
    this.awaitingFeedback = tasks.filter(task => task.status === 'await_feedback').length;
    this.tasksDone = tasks.filter(task => task.status === 'done').length;
    const urgentTasks = tasks.filter(task => task.prio === 'urgent');
    this.urgent = urgentTasks.length;
    this.totalTasks = tasks.length;
    this.getUpcomingDate(urgentTasks);
  }


  getUpcomingDate(tasks: Task[]) {
    if (tasks.length > 0) {
      const upcomingDate = tasks
        .map(task => new Date(task.due_date))
        .reduce((earliest, current) => current < earliest ? current : earliest);

      this.upComingDeadline = tasks[0].formatDeadline(upcomingDate);
      const urgendDate = tasks[0].formatDate(upcomingDate);
      console.warn('Next Urgent Task Deadline:', urgendDate);
    } else {
      this.upComingDeadline = '-';
      console.warn('No urgent tasks found');
    }
  }
}
