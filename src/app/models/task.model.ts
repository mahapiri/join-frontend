export class Task {
    status?: string = '';
    title: string = '';
    description?: string = '';
    assignedTo?: string[] = [];
    dueDate: string = '';
    prio?: string = '';
    category: string = '';
    subtasks?: string[] = [];
    createDate: string;

    constructor(obj: any) {
        this.status = obj.status || 'todo';
        this.title = obj.title;
        this.description = obj.description || '';
        this.assignedTo = obj.assignedTo || [];
        this.dueDate = obj.dueDate;
        this.prio = obj.prio || '';
        this.category = obj.category;
        this.subtasks = obj.subtasks || [];
        this.createDate = new Date().toLocaleDateString('en-UK');
    }

    getJson() {
        return {
            status : this.status,
            title : this.title,
            description : this.description,
            assignedTo : this.assignedTo,
            dueDate : this.dueDate,
            prio : this.prio,
            category : this.category,
            subtasks : this.subtasks,
            createDate : this.createDate
        }
    }
}