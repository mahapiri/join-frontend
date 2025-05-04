import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormComponent } from './form/form.component';
import { CommonModule } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { SharedService } from '../services/shared.service';
import { Contact } from '../models/contact';

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
  contacts$: Observable<Contact[]> = new Observable<Contact[]>();
  contactSubscription: Subscription = new Subscription();


  constructor(
    private titleService: Title,
    private sharedService: SharedService
  ) {
    this.titleService.setTitle("Join - Add Task");
  }

  async ngOnInit() { }

  ngOnDestroy(): void { }
}
