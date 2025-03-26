import { ChangeDetectorRef, Component } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddTaskComponent } from './popups/add-task/add-task.component';
import { CommonModule } from '@angular/common';
import { CardComponent } from './popups/card/card.component';
import { AddingComponent } from './popups/adding/adding.component';
import { EditContactComponent } from './popups/edit-contact/edit-contact.component';
import { AddContactComponent } from './popups/add-contact/add-contact.component';
import { SharedService } from './services/shared.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    DashboardComponent, 
    AddTaskComponent, 
    CardComponent, 
    AddingComponent, 
    EditContactComponent, 
    AddContactComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Join';

  constructor(
    public sharedService: SharedService,
    private cdr: ChangeDetectorRef
  ) {

  }


  close() {
    this.sharedService.closeAll();
    this.cdr.detectChanges();
  }
}
