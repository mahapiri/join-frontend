import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  apiUrl= "http://127.0.0.1:8000/api"

  constructor(private http: HttpClient) {}

  getHeaders() {
    return {
      'Content-Type': 'application/json'
    }
  }


  async createNewTask(task: Task) {
    const headers = this.getHeaders();
  
    const newTask = {
      "title": task.title,
      "description": task.description,
      "due_date": task.formatDateForDjango(task.dueDate),
      "prio": task.prio || "",
      "category": task.category
    };
  
    try {
      const data = await this.http.post(`${this.apiUrl}/tasks/`, newTask, { headers }).toPromise();
      console.log('Task erfolgreich erstellt:', data);
    } catch (err) {
      console.error('Fehler beim Erstellen des Tasks:', err);
    }
  }

  createNewSubtask(subtask: Task) {

  }


}
