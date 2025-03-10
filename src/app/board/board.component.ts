import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { DistributionComponent } from "./distribution/distribution.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [DistributionComponent, CommonModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent {
  searchTerm: string = '';
  isSearching: boolean = false;
  noTaskFound: boolean = false;
  constructor(private titleService: Title) {
    this.titleService.setTitle("Join - Board");
  }

  searchTask(event: any) {
    this.searchTerm = event.target.value.toLowerCase();
    this.isSearching = this.searchTerm.length > 0;

    if (!this.isSearching) {
      this.noTaskFound = false;
    }
  }

  noTasksFound(noTasks: boolean) {
    this.noTaskFound = noTasks;
  }
}
