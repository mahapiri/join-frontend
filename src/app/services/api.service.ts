import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {


  apiUrl = "http://127.0.0.1:8000/api"
  private usersSubject = new BehaviorSubject<User[]>([]);


  constructor() { }


  get users$(): Observable<User[]> {
    return this.usersSubject.asObservable();
  }


  async createNewTask(taskForm: any) {
    const newTask = {
      "title": taskForm.title,
      "description": taskForm.description,
      "due_date": taskForm.date,
      "category": taskForm.category,
      "prio": taskForm.prio,
    }
    const assignments = taskForm.assignments;
    const subtasks = taskForm.subtasks;

    console.log(JSON.stringify(newTask))
    console.log(assignments)
    console.log(subtasks)
    try {
      const response = await fetch(`${this.apiUrl}/tasks/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
      });

      if (!response.ok) {
        throw new Error('Fehler bei der Anfrage (NewTask)');
      }

      const data = await response.json();
      console.log('Neuer Task', data);
      if (data) {
        this.createNewSubtask(data.id, subtasks);
        this.createAssignedTo(data.id, assignments);
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

  
  async createAssignedTo(id: number, assignments: User[]) {
    console.log(assignments);
    for (const assignment of assignments) {
      let payload = {
        "contact": assignment.id,
        "task": id
      }
      try {
        const response = await fetch(`${this.apiUrl}/tasks/${id}/assignedto/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })

        if (!response.ok) {
          throw new Error('Fehler bei der Anfrage (AssignedTo)');
        }

        const data = await response.json();
        console.log("Neue Assignement wurde erstellt", data)
      } catch (error) {
        console.log('Fehler beim erstellen der Assignments', error)
      }
    }
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


  formatDateForDjango(date: Date): string {
    return `${date.getFullYear()}-${this.padZero(date.getMonth() + 1)}-${this.padZero(date.getDate())}`;
  }

  
  padZero(value: number): string {
    return value < 10 ? '0' + value : value.toString();
  }
}
