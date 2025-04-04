import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { PanelComponent } from "./panel/panel.component";
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { Task } from '../models/task.model';
import { delay, filter, Observable, Subscription, tap } from 'rxjs';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [
    PanelComponent,
    CommonModule
  ],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})
export class SummaryComponent implements OnInit, OnDestroy {

  isLoading: boolean = true;
  tasks$: Observable<Task[]> = new Observable<Task[]>();
  tasksSubscription: Subscription = new Subscription();

  constructor(
    private titleService: Title,
    private apiService: ApiService,
    private sharedService: SharedService
  ) {
    this.titleService.setTitle("Join - Summary");
    this.sharedService.setIsLoginWindow(false);
  }


  ngOnInit(): void {
    this.isLoading = true;

    this.apiService.getAllTasks();
    this.tasks$ = this.apiService.tasks$;

    this.tasksSubscription = this.tasks$.pipe(
      delay(500),
      tap(() => this.isLoading = false)
    ).subscribe();
  }



  ngOnDestroy(): void {
    this.tasksSubscription.unsubscribe();
    this.isLoading = true;
  }
}
