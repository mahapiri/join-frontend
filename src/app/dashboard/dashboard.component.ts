import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { SubmenuComponent } from "./submenu/submenu.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, RouterModule, CommonModule, SubmenuComponent, SubmenuComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss', '../../styles.scss']
})
export class DashboardComponent {
  isSubmenu = false;


  toggleSubmenu() {
    this.isSubmenu = !this.isSubmenu;
  }
}
