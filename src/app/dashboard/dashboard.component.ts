import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { SubmenuComponent } from "./submenu/submenu.component";
import { ClickOutsideDirective } from '../click-outside.directive';
import { SharedService } from '../services/shared.service';
import { LogoComponent } from '../logo/logo.component';
import { UserService } from '../services/user.service';

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
  styleUrls: ['./dashboard.component.scss', '../../styles.scss']
})
export class DashboardComponent {
  isSubmenu = false;

  constructor(
    public sharedService: SharedService,
    public userService: UserService
  ) {

  }

  toggleSubmenu() {
    this.isSubmenu = !this.isSubmenu;
  }
}
