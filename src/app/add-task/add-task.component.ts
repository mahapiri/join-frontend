import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormComponent } from './form/form.component';
// import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { User } from '../models/user.model';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [
    FormComponent,
    CommonModule
  ],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss'
})
export class AddTaskComponent implements OnInit, OnDestroy {


  isLoading: boolean = true;
  contacts$: Observable<User[]> = new Observable<User[]>();
  contactSubscription: Subscription = new Subscription();


  constructor(
    private titleService: Title,
    // private apiService: ApiService,
    private sharedService: SharedService
  ) {
    this.titleService.setTitle("Join - Add Task");
    this.sharedService.setIsLoginWindow(false);
  }

  async ngOnInit() {

    // this.apiService.getAllContacts();
    // this.contacts$ = this.apiService.contacts$;
  }

  ngOnDestroy(): void {
    // this.contactSubscription.unsubscribe();
    // this.isLoading = true;
  }
}
