import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { PanelComponent } from "./panel/panel.component";
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { Task } from '../models/task.model';
import { Observable, Subscription } from 'rxjs';

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
    private apiService: ApiService
  ) {
    this.titleService.setTitle("Join - Summary")
  }

  
  ngOnInit(): void {
    this.isLoading = true;
    this.apiService.getAllTasks();
    this.tasks$ = this.apiService.tasks$;
    this.tasksSubscription = this.tasks$.subscribe(tasks => {
      this.isLoading = false;
    })
  }


  ngOnDestroy(): void {
    if (this.tasksSubscription) {
      this.tasksSubscription.unsubscribe();
    }
    this.isLoading = true;
  }
}
