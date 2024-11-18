import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private _tasks = new BehaviorSubject<Task[]>([]);
  tasks$ = this._tasks.asObservable();

  tasks: Task[] = [];

  tasksToDo: number = 0;
  tasksInProgress: number = 0;
  awaitingFeedback: number = 0;
  tasksDone: number = 0;
  totalTasks: number = 0;
  urgent: number = 0;
  upComingDeadline: string = '-';

  constructor() {
    const exampleTask1 = new Task(
      {
        status: 'inProgress',
        title: 'TestTitle',
        description: 'Das ist eine Beschreibung',
        assignedTo: ['Sabrina Müller', 'Max Mustermann'],
        dueDate: '2024-12-15',
        prio: 'urgent',
        category: 'User Story',
        subtasks: ['Subtask1', 'Subtask2'],
        createDate: new Date(),
      }
    );

    const exampleTask2 = new Task(
      {
        status: 'todo',
        title: 'TestTitle2',
        description: 'Das ist eine Beschreibung2',
        assignedTo: ['Piri Müller', 'Mona Mustermann'],
        dueDate: '2024-12-10',
        prio: 'urgent',
        category: 'User Story',
        subtasks: ['Subtask1', 'Subtask3'],
        createDate: new Date(),
      }
    )
    this._tasks.next([exampleTask1, exampleTask2]);
  }


  updateValues(tasks: any[]) {
    this.tasksToDo = tasks.filter(task => task.status === 'todo').length;
    this.tasksInProgress = tasks.filter(task => task.status === 'inProgress').length;
    this.awaitingFeedback = tasks.filter(task => task.status === 'awaitFeedback').length;
    this.tasksDone = tasks.filter(task => task.status === 'done').length;
    const urgentTasks = tasks.filter(task => task.prio === 'urgent');
    this.urgent = urgentTasks.length;
    this.totalTasks = tasks.length;
    this.getUpcomingDate(urgentTasks);
  }


  getUpcomingDate(tasks: Task[]) {
    if (tasks.length > 0) {
      const upcomingDate = tasks
        .map(task => new Date(task.dueDate))
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
