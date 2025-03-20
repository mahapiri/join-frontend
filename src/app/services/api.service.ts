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

  async getContact() {
    const response = await fetch(`${this.apiUrl}/api/contacts/`)
  }




  async createNewTask(task: Task) {
    const headers = this.getHeaders();
    const subtasks = task.subtasks;
    const assignments = task.assignedTo;

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
          if (response) {
            if (!subtasks || !Array.isArray(subtasks) || subtasks.length === 0) {
              console.log("Keine Subtasks vorhanden.");
            } else {
              this.createNewSubtask(response.id, subtasks);
            }
            if (!assignments || !Array.isArray(assignments) || assignments.length === 0) {
              console.log("Keine AssignedTo vorhanden.");
            } else {
              this.createAssignedTo(response.id, assignments);
            }
          }
        }
      });
    } catch (err) {
      console.error('Fehler beim Erstellen des Tasks:', err);
    }
  }


  // createNewSubtask(id: number, subtasks: string[]) {
  //   const headers = this.getHeaders();

  //   subtasks.forEach(subtask => {
  //     let newSubtask = {
  //       "task": id,
  //       "title": subtask
  //     }
  //     const data = this.http.post(`${this.apiUrl}/tasks/${id}/subtasks/`, newSubtask, { headers }).subscribe({
  //       next: (response) => {
  //         console.log("subtask erstellt", response);
  //       }
  //     })
  //   });
  // }

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
        console.log(data);
      } catch (err) {
        console.log("Fehler:", err);
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

  getAllContacts() {
    const headers = this.getHeaders();

    this.http.get<User[]>(`${this.apiUrl}/contacts/`, { headers })
    .pipe(
      catchError((err) => {
        console.error('Fehler beim Laden der Kontakte', err);
        throw err;
      })
    )
    .subscribe({
      next: (response) => {
        console.log("all contacts", response)
        this.usersSubject.next(response);
      }, error: (err) => {
        console.log("Fehler beim Laden der Kontakte", err);
      }
    })
  }

  get users$(): Observable<User[]> {
    return this.usersSubject.asObservable();
  }
}
