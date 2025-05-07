import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Router } from '@angular/router';
import { TaskApiService } from '../../services/task-api.service';
import { SummaryData } from '../../models/summary-data';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './panel.component.html',
  styleUrls: [
    './panel.component.scss',
    '../summary-responsive.component.scss'
  ]
})

export class PanelComponent implements OnDestroy, OnInit {
  imgSrcTodo = '/assets/img/edit/default.svg';
  imgSrcDone = '/assets/img/check/default.svg';
  imgSrcPrio = '/assets/img/prio/urgent-active.svg';

  subscription: Subscription = new Subscription();
  summData: SummaryData | null = null;

  constructor(
    private router: Router,
    private taskApiService: TaskApiService,
    public taskService: TaskService,
  ) { }

  
  ngOnInit(): void {
    this.subscription = this.taskService.summData$.subscribe((sumdata) => {
      this.summData = sumdata;
    })
    this.taskService.loadSummary();
  }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


  navigateToBoard() {
    this.router.navigate(['/', 'board']);
  }
}
