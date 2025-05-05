import { Component, HostListener, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { PanelComponent } from "./panel/panel.component";
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [
    PanelComponent,
    CommonModule
  ],
  templateUrl: './summary.component.html',
  styleUrls: [
    './summary.component.scss',
    './summary-responsive.component.scss'
  ]
})
export class SummaryComponent implements OnInit {
  isLoading: boolean = false;
  greetingText: string = 'Hello';
  currentUser: User | null = null;
  show: boolean = true;
  isMobileView: boolean = false;

  constructor(
    private titleService: Title,
    private userService: UserService,
    public sharedService: SharedService
  ) {
    this.titleService.setTitle("Join - Summary");
    this.getCurrentUser();
    this.animateGreeting();
  }

  ngOnInit(): void {
    this.setGreeting();
    this.checkViewportWidth();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkViewportWidth();
  }

  checkViewportWidth() {
    this.isMobileView = window.innerWidth < 1024;
  }

  animateGreeting() {
    setTimeout(() => {
      this.show = false;
    }, 1000);
  }

  getCurrentUser() {
    this.userService.isLoggedIn$.subscribe(user => {
      this.currentUser = user;
    });
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