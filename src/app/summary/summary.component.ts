import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { PanelComponent } from "./panel/panel.component";
import { CommonModule } from '@angular/common';
import { SharedService } from '../services/shared.service';
import { TaskApiService } from '../services/task-api.service';

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

  isLoading: boolean = false;

  constructor(
    private titleService: Title,
    private sharedService: SharedService,
    private taskApi: TaskApiService
  ) {
    this.titleService.setTitle("Join - Summary");
    this.sharedService.setIsLoginWindow(false);
  }


  ngOnInit(): void { }



  ngOnDestroy(): void { }
}
