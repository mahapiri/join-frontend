import { ChangeDetectorRef, Component } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddTaskComponent } from './popups/add-task/add-task.component';
import { CommonModule } from '@angular/common';
import { CardComponent } from './popups/card/card.component';
import { AddingComponent } from './popups/adding/adding.component';
import { EditContactComponent } from './popups/edit-contact/edit-contact.component';
import { AddContactComponent } from './popups/add-contact/add-contact.component';
import { SharedService } from './services/shared.service';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from "./signup/signup.component";
import { AddCategoryComponent } from "./popups/add-category/add-category.component";

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
    LoginComponent,
    SignupComponent,
    AddCategoryComponent,
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
