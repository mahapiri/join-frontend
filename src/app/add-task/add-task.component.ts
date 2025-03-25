import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormComponent } from './form/form.component';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';
import { delay, filter, Observable, Subscription, tap } from 'rxjs';
import { User } from '../models/user.model';

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
    private apiService: ApiService
  ) {
    this.titleService.setTitle("Join - Add Task");
  }

  async ngOnInit() {
    this.isLoading = true;

    this.apiService.getAllContacts();
    this.contacts$ = this.apiService.contacts$;

    this.contactSubscription = this.contacts$.pipe(
      delay(0),
      filter(contacts => contacts && contacts.length > 0),
      tap(() => this.isLoading = false)
    ).subscribe(contacts => { });
  }

  ngOnDestroy(): void {
    if (this.contactSubscription) {
      this.contactSubscription.unsubscribe();
    }
    this.isLoading = true;
  }
}
