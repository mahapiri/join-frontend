import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';
import { BehaviorSubject, catchError, Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  apiUrl = "http://127.0.0.1:8000/api"


  private usersSubject = new BehaviorSubject<User[]>([]);

  constructor(private http: HttpClient) { }

  getHeaders() {
    return {
      'Content-Type': 'application/json'
    }
  }


  async createNewTask(taskForm: Task) {
    try {
      const response = await fetch(`${this.apiUrl}/tasks/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskForm)
      });

      if (!response.ok) {
        throw new Error('Fehler bei der Anfrage (NewTask)');
      }

      const data = await response.json();
      console.log('Neuer Task', data);
      if (data) {
        // subtask muss erstellt werden
        // this.createNewSubtask(response.id, subtasks);
        // assignedto muss erstellt werden
        // this.createAssignedTo(response.id, assignments);
      }
    } catch (error) {
      console.log('Fehler beim erstellen der neuen Task', error)
    }
  }
  

  async createNewSubtask(id: number, subtasks: string[]) {
    for (const subtask of subtasks) {
      let payload = {
        "task": id,
        "title": subtask
      }
      try {
        const res = await fetch(`${this.apiUrl}/tasks/${id}/subtasks/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          throw new Error('Fehler bei der Anfrage');
        }

        const data = await res.json();
        console.log('Neue Subtask wurde erstellt', data);
      } catch (error) {
        console.log("Fehler:", error);
      }
    }
  }

  createAssignedTo(id: number, assignments: User[]) {
    const headers = this.getHeaders();

    assignments.forEach((user) => {
      let newAssignement = {
        "contact": user.id,
        "task": id
      }
      this.http.post(`${this.apiUrl}/tasks/${id}/assignedto/`, newAssignement, { headers }).subscribe({
        next: (response) => {
          console.log("assignedto erstellt", response)
        }, error: (err) => {
          console.log("assign konnte nicht erstellt werden", err)
        }
      })
    })
  }


  async getAllContacts() {
    try {
      const response = await fetch(`${this.apiUrl}/contacts/`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Fehler bei der Anfrage (Contacts)');
      }

      const data = await response.json();
      this.usersSubject.next(data)
    } catch (error) {
      console.log("Fehler beim Aufruf aller Kontakte", error);
    }
  }

  get users$(): Observable<User[]> {
    return this.usersSubject.asObservable();
  }
}
