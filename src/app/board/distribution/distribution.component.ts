import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { TaskService } from '../../services/task.service';
import { CdkDragDrop, CdkDrag, moveItemInArray, transferArrayItem, DragDropModule, CdkDragStart } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-distribution',
  standalone: true,
  imports: [CommonModule, CardComponent, DragDropModule, CdkDrag],
  templateUrl: './distribution.component.html',
  styleUrls: ['./distribution.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DistributionComponent {
  @Input() searchTerm: string = '';
  @Input() isSearching: boolean = false;

  @Output() noTasksFoundEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  taskStatuses = [
    { id: 'to-do', label: 'To do', isHovered: false, isAdding: false, isDraggingOver: false, tasks: ['Task 1', 'Task 2'] },
    { id: 'in-progress', label: 'In progress', isHovered: false, isAdding: false, isDraggingOver: false, tasks: ['Task 3'] },
    { id: 'await-feedback', label: 'Await feedback', isHovered: false, isAdding: false, isDraggingOver: false, tasks: [] },
    { id: 'done', label: 'Done', isHovered: false, isAdding: false, isDraggingOver: false, tasks: [] },
  ];
  connectedToIds = this.taskStatuses.map(s => s.id);
  isDragging: boolean = false;
  dragSizeHeight: number = 200;

  constructor(private task: TaskService, private cdr: ChangeDetectorRef) {
  }

  getFilteredTasks(tasks: string[]) {
    if (!this.searchTerm) {
      this.noTasksFoundEvent.emit(false);
      this.cdr.markForCheck();
      return tasks;
    }

    const filteredTasks = tasks.filter(task =>
      task.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    const noTasks = filteredTasks.length === 0;
    this.noTasksFoundEvent.emit(noTasks);
    this.cdr.markForCheck();

    return filteredTasks;
  }


  drop(event: CdkDragDrop<string[]>) {
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

