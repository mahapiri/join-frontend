import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddTaskComponent } from './popups/add-task/add-task.component';
import { CommonModule } from '@angular/common';
import { CardComponent } from './popups/card/card.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, DashboardComponent, AddTaskComponent, CardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Join';
  isPopup: boolean = true;
  isAddTask: boolean = false;
  isCard: boolean = true;

  close() {
    this.isPopup = false;
  }
}
