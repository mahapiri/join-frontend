import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {


  apiUrl = "http://127.0.0.1:8000/api"
  private contactsSubject = new BehaviorSubject<User[]>([]);
  private tasksSubject = new BehaviorSubject<Task[]>([]);


  constructor() { }


  get contacts$(): Observable<User[]> {
    return this.contactsSubject.asObservable();
  }


  get tasks$(): Observable<Task[]> {
    return this.tasksSubject.asObservable();
  }


  async getAllTasks() {
    try {
      const response = await fetch(`${this.apiUrl}/tasks/`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Fehler bei der Anfrage (All Task)');
      }

      const datas = await response.json();

      if (datas) {
        const tasksWithAssignments = await this.fillupWithAssignments(datas);
        const tasksWithSubtasks = await this.fillupWithSubtasks(tasksWithAssignments);

        this.tasksSubject.next(tasksWithSubtasks);
      }

    } catch (error) {
      console.log('Fehler beim Abrufen der Tasks', error);
      this.tasksSubject.next([]);
    }
  }


  async fillupWithAssignments(datas: any) {
    const tasksWithAssignments = [];
    for (const data of datas) {
      const contacts = await this.getAssignedContacts(data.id);
      if (contacts.length > 0) {
        const assignments = [];
        for (const contact of contacts) {
          const assignment = await this.getContact(contact.contact);
          if (assignment) {
            assignments.push(assignment);
          }
        }
        data.assignedTo = assignments;
      }
      tasksWithAssignments.push(data);
    }

    return tasksWithAssignments;
  }


  async fillupWithSubtasks(datas: any) {
    const tasksWithSubtasks = [];
    for (const data of datas) {
      const subtasks = await this.getSubtasks(data.id);
      if (subtasks.length > 0) {
        data.subtasks = subtasks;
      }
      tasksWithSubtasks.push(data);
    }
    return tasksWithSubtasks;
  }


  async getAssignedContacts(id: number) {
    try {
      const response = await fetch(`${this.apiUrl}/tasks/${id}/assignedto/`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Fehler bei der Anfrage (All Task)');
      }
      const data = await response.json();
      return data;

    } catch (error) {
      console.log('Fehler beim erstellen der neuen Task', error)
      return [];
    }
  }


  async getSubtasks(id: number) {
    try {
      const response = await fetch(`${this.apiUrl}/tasks/${id}/subtasks/`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Fehler bei der Anfrage (All Task)');
      }
      const data = await response.json();
      return data;

    } catch (error) {
      console.log('Fehler beim erstellen der neuen Task', error)
      return [];
    }
  }


  async createNewTask(taskForm: any, newStatus: string | null) {
    const newTask = {
      "title": taskForm.title,
      "description": taskForm.description,
      "due_date": taskForm.date,
      "category": taskForm.category,
      "prio": taskForm.prio,
      ...(newStatus !== null && { "status": newStatus })
    }
    const assignments = taskForm.assignments;
    const subtasks = taskForm.subtasks;
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

  async updateTaskwithSubtaskAndAssignements(task: Task, newStatus: string) {
    let payload = {
      ...task,
      status: newStatus,
    }
    try {
      const response = await fetch(`${this.apiUrl}/tasks/${task.id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Fehler beim Aktualisieren des Status');
      }
      this.getAllTasks();
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Status:', error);
    }
  }


  formatDateForDjango(date: Date): string {
    return `${date.getFullYear()}-${this.padZero(date.getMonth() + 1)}-${this.padZero(date.getDate())}`;
  }


  padZero(value: number): string {
    return value < 10 ? '0' + value : value.toString();
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
      this.contactsSubject.next(data)
    } catch (error) {
      console.log("Fehler beim Aufruf aller Kontakte", error);
    }
  }


  async getContact(id: number) {
    try {
      const response = await fetch(`${this.apiUrl}/contacts/${id}/`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Fehler bei der Anfrage (Contacts)');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.log("Fehler beim Aufruf aller Kontakte", error);
      return null;
    }
  }


  async createContact(contact: User) {
    try {
      const newContact = {
        "name": contact.name,
        "email": contact.email,
        "phone": contact.phone,
        "color": this.getRandomColor(),
      }
      const response = await fetch(`${this.apiUrl}/contacts/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContact)
      })

      if (!response.ok) {
        throw new Error('Fehler bei der Anfrage (Create Contact)');
      }

      const data = await response.json();
      await this.getAllContacts();

      return data.id;

    } catch (error) {
      console.log("Fehler beim erstellen des neuen Kontakts: ", error)
      return null;
    }
  }


  readonly colors: string[] = [
    '--orange',
    '--pink',
    '--purple',
    '--purple-lighten',
    '--turquoise',
    '--salmon',
    '--orange-lighten',
    '--rosa',
    '--yellow-orange',
    '--neon-yellow',
    '--yellow',
    '--red',
    '--orange-lighten',
  ]


  getRandomColor(): string {
    const randomIndex = Math.floor(Math.random() * this.colors.length);
    return this.colors[randomIndex];
  }


  async editContact(newValue: User, currentContact: User) {
    try {
      const editableContact = {
        "name": newValue.name,
        "email": newValue.email,
        "phone": newValue.phone,
        "color": currentContact.color,
      }
      const response = await fetch(`${this.apiUrl}/contacts/${currentContact.id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editableContact)
      })

      if (!response.ok) {
        throw new Error('Fehler bei der Anfrage (Create Contact)');
      }

      const data = await response.json();
      await this.getAllContacts();

      return data.id;

    } catch (error) {
      console.log("Fehler beim erstellen des neuen Kontakts: ", error)
      return null;
    }
  }


  async deleteContact(currentContact: User) {
    try {
      const response = await fetch(`${this.apiUrl}/contacts/${currentContact.id}/`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        throw new Error('Fehler bei der Anfrage (Delete Contact)');
      }

      await this.getAllContacts();

    } catch (error) {
      console.log("Fehler beim löschen des neuen Kontakts: ", error)
    }
  }


  async deleteTask(id: number) {
    try {
      const response = await fetch(`${this.apiUrl}/tasks/${id}/`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        throw new Error('Fehler bei der Anfrage (Delete Contact)');
      }

      await this.getAllTasks();

    } catch (error) {
      console.log("Fehler beim löschen des neuen Kontakts: ", error)
    }
  }
}
