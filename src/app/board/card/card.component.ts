import { AfterViewInit, ChangeDetectorRef, Component, Input } from '@angular/core';
import { Task } from '../../models/task.model';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-card',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements AfterViewInit {
  subtaskStatus: string = '';
  @Input() task!: Task;
  doneSubtasks: number = 0;

  constructor(
    private cdr: ChangeDetectorRef,
  ) {}


  ngAfterViewInit(): void {
      if(this.task) {
        this.getDoneSubtasks();
      }
  }


  getDoneSubtasks() {
    if (!this.task || !this.task.subtasks) return;
  
    this.doneSubtasks = 0;
  
    this.task.subtasks.forEach(subtask => {
      if (subtask.done) {
        this.doneSubtasks++;
      }
    });
  
    this.calculateSubtaskStatus();
    this.cdr.detectChanges();
  }


  calculateSubtaskStatus() {
    if (this.task?.subtasks?.length) {
      this.subtaskStatus = ((this.doneSubtasks * 100) / this.task.subtasks.length).toFixed(2) + '%';
    } else {
      this.subtaskStatus = '0%';
    }
  }
}