import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-distribution',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './distribution.component.html',
  styleUrls: ['./distribution.component.scss']
})
export class DistributionComponent {
  taskStatuses = [
    { label: 'To do', isHovered: false, isAdding: false, tasks: ['1'] },
    { label: 'In progress', isHovered: false, isAdding: false, tasks: [] },
    { label: 'Await feedback', isHovered: false, isAdding: false, tasks: [] },
    { label: 'Done', tasks: [] },
  ];

  constructor(private task: TaskService) {

  }

  isDragging: boolean = false;


  onMouseOver(status: any) {
    status.isHovered = true;
  }


  onMouseLeave(status: any) {
    status.isHovered = false;
  }


  toggleAddTask(status: any) {
    status.isAdding = !status.isAdding;
  }

  startDragging() {
    this.isDragging = true;
  }
}
