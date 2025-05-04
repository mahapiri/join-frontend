import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { PanelComponent } from "./panel/panel.component";
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';

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
  currentUser: User | null = null;


  constructor(
    private titleService: Title,
    private userService: UserService,
  ) {
    this.titleService.setTitle("Join - Summary");
    this.getCurrentUser();
  }
  
  getCurrentUser() {
    this.userService.isLoggedIn$.subscribe(user => {
      this.currentUser = user;
    })
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
