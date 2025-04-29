import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskApiService {
  apiUrl = "http://127.0.0.1:8000/api/tasks"

  constructor() { }


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

      const newAddedTask = await response.json();

      if (newAddedTask) {
        return newAddedTask;
      }
    } catch (error) {
      console.log('Fehler', error)
      return null;
    }
  }


  async getAllCategories() {
    try {
      const response = await fetch(`${this.apiUrl}/category/`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      const categories = await response.json();

      if (categories) {
        return categories;
      }
    } catch (error) {
      return null;
    }
  }


  async getAllTasks() {
    try {
      const response = await fetch(`${this.apiUrl}/`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      const tasks = await response.json();

      if (tasks) {
        return tasks;
      }
    } catch (error) {
      return null;
    }
  }


  async getSummaryData() {
    try {
      const response = await fetch(`${this.apiUrl}/summary/`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      const summData = await response.json();

      if (summData) {
        summData['upcoming_deadline'] = this.formatDate(summData['upcoming_deadline']);
        return summData;
      }

    } catch (error) {
      console.log('Fehler', error)
      return null;
    }
  }


  formatDate(date: string): string {
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
