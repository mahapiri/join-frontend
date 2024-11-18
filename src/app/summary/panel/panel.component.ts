import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.scss'
})
export class PanelComponent implements OnDestroy {
  imgSrcTodo = 'assets/img/edit/default.svg';
  imgSrcDone = 'assets/img/check/default.svg';
  imgSrcPrio = 'assets/img/prio/urgent-active.svg';

  taskServiceSubscription: Subscription = new Subscription();

  constructor(public taskService: TaskService, private router: Router) {
    this.taskServiceSubscription = this.taskService.tasks$.subscribe((tasks) => {
      this.taskService.updateValues(tasks);
    })
  }

  ngOnDestroy(): void {
      this.taskServiceSubscription.unsubscribe();
  }

  navigateToBoard() {
    this.router.navigate(['/', 'board']);
  }

}
