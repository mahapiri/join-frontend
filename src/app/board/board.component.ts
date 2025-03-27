import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { DistributionComponent } from "./distribution/distribution.component";
import { CommonModule } from '@angular/common';
import { SharedService } from '../services/shared.service';
import { ApiService } from '../services/api.service';
import { delay, filter, tap } from 'rxjs';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [DistributionComponent, CommonModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardComponent {
  searchTerm: string = '';
  noTaskFound: boolean = false;
  isSearching: boolean = false;

  constructor(
    private titleService: Title, 
    private cdr: ChangeDetectorRef,
    private sharedService: SharedService,
  ) {
    this.titleService.setTitle("Join - Board");
  }


  searchTask(event: any) {
    const searchTerm = event.target.value.trim().toLowerCase();
    this.sharedService.setSearchTerm(searchTerm);
    this.sharedService.setIsSearchingTerm(true);
  }

  noTasksFound(noTasks: boolean) {
    this.noTaskFound = noTasks;
  }

  openAddTask() {
    this.sharedService.isPopup = true;
    this.sharedService.isAddTask = true;
  }
}
