import { Injectable } from '@angular/core';
import { Subtask, Task } from '../models/task.model';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class TaskApiService {
  apiUrl = "https://join-backend-p0l1.onrender.com/api/tasks"

  constructor() { }


  async createNewTask(taskForm: Task, newStatus: string) {
    const newTask = {
      "title": taskForm.title,
      "description": taskForm.description,
      "due_date": taskForm.due_date,
      "category": taskForm.category,
      "prio": taskForm.prio,
      "assigned_contacts": taskForm.assigned_contacts,
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
      console.warn('Error create new task:', error)
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
      console.warn('Error get all tasks:', error)
      return null;
    }
  }


  async updateTask(task: Task) {
    if (task.due_date instanceof Date) task.due_date = this.formatDateForDjango(task.due_date) as any;
    try {
      const response = await fetch(`${this.apiUrl}/${task.id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      })

      const updatedTask = await response.json();

      if (updatedTask) return updatedTask;
    } catch (error) {
      console.warn('Error update task:', error)
      return null;
    }
  }


  async deleteTask(task: Task) {
    try {
      await fetch(`${this.apiUrl}/${task.id}/`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      })
    } catch (error) {
      console.warn('Error delete selected task:', error)
    }
  }


  async deleteSubtask(subtaskId: number) {
    try {
      await fetch(`${this.apiUrl}/subtask/delete/${subtaskId}/`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      })
    } catch (error) {
      console.warn('Error delete selected task:', error)
    }
  }


  async getAllCategories() {
    try {
      const response = await fetch(`${this.apiUrl}/category/`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      const categories = await response.json();

      if (categories) return categories;
    } catch (error) {
      console.warn('Error get all categories:', error);
      return null;
    }
  }


  async createCategory(category: Category) {
    try {
      const response = await fetch(`${this.apiUrl}/category/create/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(category),
      })

      const newCategory = await response.json();

      console.log(newCategory)
      if (newCategory) return newCategory
    } catch (error) {
      console.warn('Error create new category:', error);
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
        if (summData['upcoming_deadline']) summData['upcoming_deadline'] = this.formatDate(summData['upcoming_deadline']);
        return summData;
      }

    } catch (error) {
      console.warn('Error get summary datas:', error)
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
