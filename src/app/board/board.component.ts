import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { DistributionComponent } from "./distribution/distribution.component";
import { CommonModule } from '@angular/common';
import { SharedService } from '../services/shared.service';

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
  isSearching: boolean = false;
  noTaskFound: boolean = false;
  constructor(
    private titleService: Title, 
    private cdr: ChangeDetectorRef,
    private sharedService: SharedService
  ) {
    this.titleService.setTitle("Join - Board");
  }


  searchTask(event: any) {
    this.searchTerm = event.target.value.toLowerCase();
    this.isSearching = this.searchTerm.length > 0;

    if (!this.isSearching) {
      this.noTaskFound = false;
    }
    this.cdr.markForCheck();
  }

  noTasksFound(noTasks: boolean) {
    this.noTaskFound = noTasks;
    this.cdr.markForCheck();
  }

  openAddTask() {
    this.sharedService.isPopup = true;
    this.sharedService.isAddTask = true;
  }
}
