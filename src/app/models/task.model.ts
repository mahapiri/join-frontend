import { Category } from "./category";
import { Contact } from "./contact";

export class Task {
    id: number;
    title: string = '';
    description?: string = '';
    due_date: Date;
    status?: string = '';
    category: Category;
    prio?: string = '';
    assigned_contacts?: Contact[] = [];
    subtasks?: Subtask[] = [];

    constructor(obj: any) {
        this.id = obj.id;
        this.status = obj.status || 'to_do';
        this.title = obj.title;
        this.description = obj.description || '';
        this.assigned_contacts = obj.assigned_contacts || [];
        this.due_date = obj.due_date ? new Date(obj.due_date) : new Date();
        this.prio = obj.prio || '';
        this.category = obj.category;
        this.subtasks = obj.subtasks || [];
    }

    getJson() {
        return {
            id: this.id,
            status: this.status,
            title: this.title,
            description: this.description,
            assigned_contacts: this.assigned_contacts,
            dueDate: this.due_date,
            prio: this.prio,
            category: this.category,
            subtasks: this.subtasks,
        }
    }

    formatDateForDjango(date: Date): string {
        return `${date.getFullYear()}-${this.padZero(date.getMonth() + 1)}-${this.padZero(date.getDate())}`;
    }

    formatDate(date: Date): string {
        return `${this.padZero(date.getDate())}/${this.padZero(date.getMonth() + 1)}/${date.getFullYear()}`;
    }

    formatDeadline(date: Date): string {
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
        ];

        const day = this.padZero(date.getDate());
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();

        return `${month}, ${day}, ${year}`;
    }

    padZero(value: number): string {
        return value < 10 ? '0' + value : value.toString();
    }
}

export class Subtask {
    id: number;
    subtask: string;
    is_completed: boolean;
    task_id: number;


    constructor(obj: any) {
        this.id = obj.id;
        this.subtask = obj.subtask;
        this.is_completed = obj.is_completed;
        this.task_id = obj.task_id;
    }


    getJson() {
        return {
            id: this.id,
            subtask: this.subtask,
            is_completed: this.is_completed,
            task_id: this.task_id,
        }
    }
}