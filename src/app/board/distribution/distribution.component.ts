import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, ChangeDetectorRef, ChangeDetectionStrategy, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { TaskService } from '../../services/task.service';
import { CdkDragDrop, CdkDrag, moveItemInArray, transferArrayItem, DragDropModule, CdkDragStart } from '@angular/cdk/drag-drop';
import { ApiService } from '../../services/api.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-distribution',
  standalone: true,
  imports: [
    CommonModule, 
    CardComponent, 
    DragDropModule, 
    CdkDrag
  ],
  templateUrl: './distribution.component.html',
  styleUrls: ['./distribution.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DistributionComponent {
  @Input() searchTerm: string = '';
  @Input() isSearching: boolean = false;

  @Output() noTasksFoundEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  taskStatuses = [
    { id: 'to_do', label: 'To do', isHovered: false, isAdding: false, isDraggingOver: false, tasks: [] as Task[] },
    { id: 'in_progress', label: 'In progress', isHovered: false, isAdding: false, isDraggingOver: false, tasks: [] as Task[]  },
    { id: 'await_feedback', label: 'Await feedback', isHovered: false, isAdding: false, isDraggingOver: false, tasks: [] as Task[]  },
    { id: 'done', label: 'Done', isHovered: false, isAdding: false, isDraggingOver: false, tasks: [] as Task[]  },
  ];
  connectedToIds: string[] = [];
  isDragging: boolean = false;
  dragSizeHeight: number = 200;

  
  constructor(
    private task: TaskService, 
    private cdr: ChangeDetectorRef,
    private apiService: ApiService
  ) {
    this.connectedToIds = this.taskStatuses.map(s => s.id);
    this.apiService.getAllTasks();
    this.apiService.tasks$.subscribe((tasks) => {
      this.taskStatuses.forEach(status => status.tasks = []);
      tasks.forEach(task => {
        const status = this.taskStatuses.find(s => s.id === task.status);
        if (status) {
          status.tasks.push(task)
        }
      });
      this.cdr.markForCheck();
    });
  }


  getFilteredTasks(tasks: Task[]) {
    if (!this.searchTerm) {
      this.noTasksFoundEvent.emit(false);
      this.cdr.markForCheck();
      return tasks;
    }

    const filteredTasks = tasks.filter(task =>
      task.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    const noTasks = filteredTasks.length === 0;
    this.noTasksFoundEvent.emit(noTasks);
    this.cdr.markForCheck();

    return filteredTasks;
  }


  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }


  setDragSize(event: CdkDragStart) {
    const element = event.source.element.nativeElement;
    this.dragSizeHeight = element.offsetHeight + 32;
  }


  onMouseOver(status: any) {
    status.isHovered = true;
  }


  onMouseLeave(status: any) {
    status.isHovered = false;
  }


  toggleAddTask(status: any) {
    status.isAdding = !status.isAdding;
  }


  dragEntered(status: any) {
    status.isDraggingOver = true;
  }


  dragExited(status: any) {
    status.isDraggingOver = false;
  }
}

