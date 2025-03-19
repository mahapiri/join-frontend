import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  apiUrl = "http://127.0.0.1:8000/api"

  constructor(private http: HttpClient) { }

  getHeaders() {
    return {
      'Content-Type': 'application/json'
    }
  }


  async createNewTask(task: Task) {
    const headers = this.getHeaders();
    const subtasks = task.subtasks;
    console.log(subtasks)

    const newTask = {
      "title": task.title,
      "description": task.description,
      "due_date": task.formatDateForDjango(task.dueDate),
      "prio": task.prio || "",
      "category": task.category
    };

    try {
      const data = await this.http.post<{ id: number }>(`${this.apiUrl}/tasks/`, newTask, { headers }).subscribe({
        next: (response) => {
          console.log('Task erfolgreich erstellt:', response);
          console.log(response.id)
          if (response) {
            if (!subtasks || !Array.isArray(subtasks) || subtasks.length === 0) { 
              console.log("Keine Subtasks vorhanden.");
              return;
            }

            if(subtasks.length > 0) {
              this.createNewSubtask(response.id, subtasks);
            }

          }
        }
      });
    } catch (err) {
      console.error('Fehler beim Erstellen des Tasks:', err);
    }
  }

  createNewSubtask(id: number, subtasks: string[]) {
    const headers = this.getHeaders();

    subtasks.forEach(subtask => {
      let newSubtask = {
        "task": id,
        "title": subtask
      }
      const data = this.http.post(`${this.apiUrl}/tasks/${id}/subtasks/`, newSubtask, { headers }).subscribe({
        next: (response) => {
          console.log("subtask erstellt", response);
        }
      })
    });
  }
}
