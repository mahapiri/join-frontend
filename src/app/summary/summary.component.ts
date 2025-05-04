import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { PanelComponent } from "./panel/panel.component";
import { CommonModule } from '@angular/common';
import { SharedService } from '../services/shared.service';

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
export class SummaryComponent implements OnInit {

  isLoading: boolean = false;
  greetingText: string = 'Hello';


  constructor(
    private titleService: Title,
    private sharedService: SharedService,
  ) {
    this.titleService.setTitle("Join - Summary");
  }


  ngOnInit(): void {
    this.setGreeting();
  }


  setGreeting() {
    let now: Date = new Date();
    let hour = now.getHours();

    if (hour < 12) {
      this.greetingText = 'Good Morning';
    } else if (hour < 15) {
      this.greetingText = 'Good Day';
    } else if (hour < 18) {
      this.greetingText = 'Good Afternoon';
    } else {
      this.greetingText = 'Good Evening';
    }
  }
}
