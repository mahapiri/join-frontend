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
  ) {
    
  }


  ngAfterViewInit(): void {
      if(this.task) {
        this.getDoneSubtasks();
      }
  }


  getDoneSubtasks() {
    this.task.subtasks?.forEach(subtask => {
      this.doneSubtasks = 0;
      console.log(subtask)
      if (subtask.done == true) {
        this.doneSubtasks++;
      }
      this.calculateSubtaskStatus();
      this.cdr.detectChanges();
    })
  }


  calculateSubtaskStatus() {
    if(this.task.subtasks) {
      this.subtaskStatus = ((this.doneSubtasks * 100)/this.task.subtasks?.length).toString() + '%';
      console.log(this.subtaskStatus);
    }
  }
}