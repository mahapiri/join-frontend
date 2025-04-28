import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../models/task.model';
import { SummaryData } from '../models/summary-data';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class TaskApiService {
  private _sumdata = new BehaviorSubject<SummaryData | null>(null);
  summData$ = this._sumdata.asObservable();
  private _categories = new BehaviorSubject<Category[]>([]);
  categories$ = this._categories.asObservable();
  private _tasks = new BehaviorSubject<Task[]>([]);
  tasks$ = this._tasks.asObservable();

  apiUrl = "http://127.0.0.1:8000/api/tasks"

  constructor() {
    this.getAllCategories().then(categories => {
      this._categories.next(categories);
    })
    this.getAllTasks().then(tasks => {
      this._tasks.next(tasks);
    })
  }


  async createNewTask(taskForm: Task, newStatus: string) {
    const newTask = {
      "title": taskForm.title,
      "description": taskForm.description,
      "due_date": taskForm.due_date,
      "category": taskForm.category["id"],
      "prio": taskForm.prio,
      "assigned_contacts": taskForm.assigned_contacts?.map(assignment => assignment.id),
      "subtasks": taskForm.subtasks,
      ...(newStatus !== null && { "status": newStatus })
    }
    try {
      const response = await fetch(`${this.apiUrl}/create/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      })

      const datas = await response.json();

      if (datas) {
        console.log(datas)
      }
    } catch (error) {
      console.log('Fehler', error)
    }
  }


  async getAllCategories() {
    try {
      const response = await fetch(`${this.apiUrl}/category/`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      const datas = await response.json();

      if (datas) {
        return datas;
      }
    } catch (error) {
      return [];
    }
  }

  async getAllTasks() {
    try {
      const response = await fetch(`${this.apiUrl}/`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      const datas = await response.json();

      if (datas) {
        return datas;
      }
    } catch (error) {
      return [];
    }
  }


  async getSummaryData() {
    try {
      const response = await fetch(`${this.apiUrl}/summary/`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      const datas = await response.json();

      if (datas) {
        datas['upcoming_deadline'] = this.formatDate(datas['upcoming_deadline'])
        this._sumdata.next(datas);
      }

    } catch (error) {
      console.log('Fehler', error)
      this._sumdata.next(null);
    }
  }


  formatDate(date: any): string {
    let splitValues = date.split("-");
    return `${splitValues[2]}/${splitValues[1]}/${splitValues[0]}`;
  }


  formatDateForDjango(date: Date): string {
    return `${date.getFullYear()}-${this.padZero(date.getMonth() + 1)}-${this.padZero(date.getDate())}`;
  }


  padZero(value: number): string {
    return value < 10 ? '0' + value : value.toString();
  }
}
