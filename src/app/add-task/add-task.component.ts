import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormComponent } from './form/form.component';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';

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


  constructor(private titleService: Title, private apiService: ApiService) {
    this.titleService.setTitle("Join - Add Task");

  }

  async ngOnInit() {
    this.isLoading = true;
    await this.getAllContacts();
    this.isLoading = false;
  }

  ngOnDestroy(): void {
    this.isLoading = true;
  }

  async getAllContacts() {
    await this.apiService.getAllContacts();
  }
}
