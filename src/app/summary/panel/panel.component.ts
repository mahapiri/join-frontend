import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.scss'
})

export class PanelComponent implements OnDestroy, OnInit {
  imgSrcTodo = 'assets/img/edit/default.svg';
  imgSrcDone = 'assets/img/check/default.svg';
  imgSrcPrio = 'assets/img/prio/urgent-active.svg';

  subscription: Subscription = new Subscription();
  @Input() tasks$!: Observable<Task[]>;
  tasks: Task[] = [];

  constructor(
    public taskService: TaskService, 
    private router: Router
  ) { }


  ngOnInit(): void {
    this.subscription = this.tasks$.subscribe(tasks => {
      this.tasks = tasks;
      this.taskService.updateValues(tasks);
    });
  }


  ngOnDestroy(): void {
    if(this.subscription){
      this.subscription.unsubscribe();
    }    
  }

  
  navigateToBoard() {
    this.router.navigate(['/', 'board']);
  }
}
