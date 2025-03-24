import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { PanelComponent } from "./panel/panel.component";
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';

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

  constructor(
    private titleService: Title,
    private apiService: ApiService
  ) {
    this.titleService.setTitle("Join - Summary")
  }

  async ngOnInit() {
    this.isLoading = true;
    await this.getAllTasks();
    this.isLoading = false;
  }


  ngOnDestroy(): void {
    this.isLoading = true;
  }

  
  async getAllTasks() {
    await this.apiService.getAllTasks();
  }
}
