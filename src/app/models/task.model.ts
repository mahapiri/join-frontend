import { User } from "./user.model";

export class Task {
    id: number;
    status?: string = '';
    title: string = '';
    description?: string = '';
    assignedTo?: User[] = [];
    due_date: Date;
    prio?: string = '';
    category: string = '';
    subtasks?: Subtask[] = [];
    createDate: Date;

    constructor(obj: any) {
        this.id = obj.id;
        this.status = obj.status || 'to_do';
        this.title = obj.title;
        this.description = obj.description || '';
        this.assignedTo = obj.assignedTo || [];
        this.due_date = obj.due_date ? new Date(obj.due_date) : new Date();
        this.prio = obj.prio || '';
        this.category = obj.category;
        this.subtasks = obj.subtasks || [];
        this.createDate = new Date();
    }

    getJson() {
        return {
            id: this.id,
            status: this.status,
            title: this.title,
            description: this.description,
            assignedTo: this.assignedTo,
            dueDate: this.due_date,
            prio: this.prio,
            category: this.category,
            subtasks: this.subtasks,
            createDate: this.createDate
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
    task: number;
    task_title: string;
    title: string;
    done: boolean;

    
    constructor(obj: any) {
        this.id = obj.id;
        this.task = obj.task;
        this.task_title = obj.task_title;
        this.title = obj.title;
        this.done = obj.done;
    }


    getJson() {
        return {
            id: this.id,
            task: this.task,
            task_title: this.task_title,
            title: this.title,
            done: this.done,
        }
    }
}