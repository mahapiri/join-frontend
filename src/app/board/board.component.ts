import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { DistributionComponent } from "./distribution/distribution.component";
import { CommonModule } from '@angular/common';
import { SharedService } from '../services/shared.service';
import { TaskService } from '../services/task.service';

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
    private sharedService: SharedService,
    private taskService: TaskService,
  ) {
    this.titleService.setTitle("Join - Board");
    this.sharedService.setIsLoginWindow(false);
  }


  searchTask(event: any) {
    const searchTerm = event.target.value.trim().toLowerCase();
    this.taskService.setSearchTerm(searchTerm);
    this.taskService.setIsSearchingTerm(true);
    if(searchTerm == '') this.noTasksFound(false);
  }


  noTasksFound(noTasks: boolean) {
    this.noTaskFound = noTasks;
  }

  
  openAddTask() {
    this.sharedService.isPopup = true;
    this.sharedService.isAddTask = true;
  }
}
