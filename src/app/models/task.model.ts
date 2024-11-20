import { User } from "./user.model";

export class Task {
    status?: string = '';
    title: string = '';
    description?: string = '';
    assignedTo?: User[] = [];
    dueDate: Date;
    prio?: string = '';
    category: string = '';
    subtasks?: string[] = [];
    createDate: Date;

    constructor(obj: any) {
        this.status = obj.status || 'todo';
        this.title = obj.title;
        this.description = obj.description || '';
        this.assignedTo = obj.assignedTo || [];
        this.dueDate = obj.dueDate ? new Date(obj.dueDate) : new Date();
        this.prio = obj.prio || '';
        this.category = obj.category;
        this.subtasks = obj.subtasks || [];
        this.createDate = new Date();
    }

    getJson() {
        return {
            status: this.status,
            title: this.title,
            description: this.description,
            assignedTo: this.assignedTo,
            dueDate: this.dueDate,
            prio: this.prio,
            category: this.category,
            subtasks: this.subtasks,
            createDate: this.createDate
        }
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