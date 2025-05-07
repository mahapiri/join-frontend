import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { SubmenuComponent } from "./submenu/submenu.component";
import { ClickOutsideDirective } from '../click-outside.directive';
import { SharedService } from '../services/shared.service';
import { LogoComponent } from '../logo/logo.component';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterLink,
    RouterModule,
    CommonModule,
    SubmenuComponent,
    SubmenuComponent,
    ClickOutsideDirective,
    LogoComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: [
    './dashboard.component.scss',
    '../../styles.scss',
    './dashboard-responsive.component.scss'
  ]
})
export class DashboardComponent implements OnInit {
  isSubmenu = false;
  noUser = false;
  currentUser: User | null = null;
  isLoading: boolean = false;

  constructor(
    public sharedService: SharedService,
    public userService: UserService,
    private router: Router
  ) { }


  ngOnInit(): void {
    this.getCurrentUser();
    this.isLoading = true
  }


  getCurrentUser() {
    this.userService.isLoggedIn$.subscribe(user => {
      this.currentUser = user;
    })
  }


  toggleSubmenu() {
    this.isSubmenu = !this.isSubmenu;
  }


  navigateTo(path: string) {
    this.router.navigate([`/${path}`]);
    this.sharedService.setSiteviewer(false);
  }
}
