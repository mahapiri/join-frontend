import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, ChangeDetectorRef, ChangeDetectionStrategy, CUSTOM_ELEMENTS_SCHEMA, OnInit, OnDestroy } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { TaskService } from '../../services/task.service';
import { CdkDragDrop, CdkDrag, moveItemInArray, transferArrayItem, DragDropModule, CdkDragStart } from '@angular/cdk/drag-drop';
import { Task } from '../../models/task.model';
import { SharedService } from '../../services/shared.service';
import { delay, Subscription, tap } from 'rxjs';
import { TaskApiService } from '../../services/task-api.service';

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
export class DistributionComponent implements OnInit, OnDestroy {
  @Input() searchTerm: string = '';
  @Input() isSearching: boolean = false;

  @Output() noTasksFoundEvent: EventEmitter<boolean> = new EventEmitter<boolean>(false);
  @Output() isLoadingEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  subscriptions: Subscription = new Subscription();

  taskStatuses = [
    { id: 'to_do', label: 'To do', isHovered: false, isAdding: false, isDraggingOver: false, tasks: [] as Task[] },
    { id: 'in_progress', label: 'In progress', isHovered: false, isAdding: false, isDraggingOver: false, tasks: [] as Task[] },
    { id: 'await_feedback', label: 'Await feedback', isHovered: false, isAdding: false, isDraggingOver: false, tasks: [] as Task[] },
    { id: 'done', label: 'Done', isHovered: false, isAdding: false, isDraggingOver: false, tasks: [] as Task[] },
  ];

  connectedToIds: string[] = [];
  isDragging: boolean = false;
  dragSizeHeight: number = 200;
  draggable: boolean = true;
  isLoading: boolean = true;
  filteredTasks: { [key: string]: Task[] } = {};

  constructor(
    private cdr: ChangeDetectorRef,
    private sharedService: SharedService,
    private taskService: TaskService,
    private taskApiService: TaskApiService,
  ) { }


  updateFilteredTasks() {
    this.taskStatuses.forEach(status => {
      this.filteredTasks[status.id] = this.getFilteredTasks(status.tasks);
    });
    this.cdr.markForCheck();
  }


  isSearchingSubscription() {
    this.subscriptions.add(
      this.taskService.isSearching$.subscribe(isSearching => {
        this.isSearching = isSearching
      })
    )
  }


  searchTermSubscription() {
    this.subscriptions.add(
      this.taskService.searchTerm$.subscribe(searchTerm => {
        this.searchTerm = searchTerm;
        this.updateFilteredTasks();
        this.cdr.markForCheck();
        this.cdr.detectChanges();
        this.checkForNoResults();
      })
    )
  }


  tasksSubscription() {
    this.subscriptions.add(
      this.taskService.tasks$
        .pipe(
          delay(250),
          tap(() => this.isLoading = false)
        )
        .subscribe((tasks) => {
          this.taskStatuses.forEach(status => status.tasks = []);
          tasks.forEach(task => {
            const status = this.taskStatuses.find(s => s.id === task.status);
            if (status) status.tasks.push(task);
          });
          this.updateFilteredTasks();
          this.checkForNoResults();
        })
    )
  }


  ngOnInit() {
    this.taskService.loadTasks();
    this.isSearchingSubscription();
    this.searchTermSubscription();
    this.tasksSubscription();
    this.isLoading = true;
    this.connectedToIds = this.taskStatuses.map(s => s.id);
  }


  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }


  getFilteredTasks(tasks: Task[]) {
    if (!this.searchTerm) {
      return tasks;
    }

    return tasks.filter(task =>
      task.title.toLowerCase().includes(this.searchTerm) || task.description?.toLowerCase().includes(this.searchTerm)
    );
  }


  checkForNoResults() {
    if (this.isSearching) {
      const noTasksFound = this.taskStatuses.every(status => {
        return this.filteredTasks[status.id]?.length === 0;
      });

      this.noTasksFoundEvent.emit(noTasksFound);
    }
  }


  async drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      const movedTask = event.container.data[event.currentIndex];
      movedTask.status = event.container.id;
      this.draggable = false;
      this.cdr.detectChanges();
      await this.taskApiService.updateTask(movedTask);
      setTimeout(() => {
        this.draggable = true;
        this.cdr.detectChanges();
      }, 500);
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

  openAddTask(status: any) {
    this.sharedService.isPopup = true;
    this.sharedService.isAddTask = true;
    if (status.id === 'in_progress') {
      this.sharedService.isAddTaskInProgress = true;
    }
    if (status.id === 'await_feedback') {
      this.sharedService.isAddTaskInAwaitFeedback = true;
    }
  }


  dragEntered(status: any) {
    status.isDraggingOver = true;
  }


  dragExited(status: any) {
    status.isDraggingOver = false;
  }


  openTaskCard(task: Task) {
    this.taskService.updateClickedTaskCard(task);
    this.sharedService.isPopup = true;
    this.sharedService.isCard = true;
  }
}

