import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddTaskComponent } from './popups/add-task/add-task.component';
import { CommonModule } from '@angular/common';
import { CardComponent } from './popups/card/card.component';
import { AddingComponent } from './popups/adding/adding.component';
import { EditContactComponent } from './popups/edit-contact/edit-contact.component';
import { AddContactComponent } from './popups/add-contact/add-contact.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, DashboardComponent, AddTaskComponent, CardComponent, AddingComponent, EditContactComponent, AddContactComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Join';
  isPopup: boolean = true;
  isAddTask: boolean = false;
  isCard: boolean = false;
  isAdding: boolean = false;
  isAddContact: boolean = true;
  isEditContact: boolean = false;

  close() {
    this.isPopup = false;
  }
}
