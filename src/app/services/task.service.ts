import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';
import { BehaviorSubject } from 'rxjs';
import { TaskApiService } from './task-api.service';
import { SummaryData } from '../models/summary-data';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  tasksToDo: number = 0;
  tasksInProgress: number = 0;
  awaitingFeedback: number = 0;
  tasksDone: number = 0;
  totalTasks: number = 0;
  urgent: number = 0;
  upComingDeadline: string = '-';

  private _clickedTaskCardSubject = new BehaviorSubject<any>(Task);
  clickedTaskCard$ = this._clickedTaskCardSubject.asObservable();

  private searchTermSubject = new BehaviorSubject<string>('');
  searchTerm$ = this.searchTermSubject.asObservable();

  private _isSearching = new BehaviorSubject<boolean>(false);
  isSearching$ = this._isSearching.asObservable();

  private _tasks = new BehaviorSubject<Task[]>([]);
  tasks$ = this._tasks.asObservable();

  private _sumdata = new BehaviorSubject<SummaryData | null>(null);
  summData$ = this._sumdata.asObservable();

  private _categories = new BehaviorSubject<Category[]>([]);
  categories$ = this._categories.asObservable();

  constructor(
    private taskApiService: TaskApiService,
  ) {
  }

  async loadCategories() {
    const categories = await this.taskApiService.getAllCategories();
    this._categories.next(categories);
  }

  async loadSummary() {
    const sumdata = await this.taskApiService.getSummaryData();
    this.updateSummdata(sumdata);
  }


  updateSummdata(sumdata: SummaryData) {
    this._sumdata.next(sumdata);
  }


  async loadTasks() {
    const tasks = await this.taskApiService.getAllTasks();
    this._tasks.next(tasks);
  }


  setNewTask(newTask: Task) {
    const currentTasks = this._tasks.value;
    const updatedTasks = [...currentTasks, newTask];
    this._tasks.next(updatedTasks);
    this.loadSummary();
  }


  updateClickedTaskCard(task: Task) {
    this._clickedTaskCardSubject.next(task);
    console.log(task)
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
    } else {
      this.upComingDeadline = '-';
    }
  }


  setSearchTerm(searchTerm: string) {
    this.searchTermSubject.next(searchTerm);
  }


  setIsSearchingTerm(isSearching: boolean) {
    this._isSearching.next(isSearching);
  }
}
