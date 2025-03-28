import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-submenu',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './submenu.component.html',
  styleUrl: './submenu.component.scss'
})
export class SubmenuComponent {
  @Input() isSubmenu:boolean = false;
  @Output() isSubmenuChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private router: Router
  ) {

  }

  toggleSubmenu() {
    this.isSubmenu = !this.isSubmenu;
    this.isSubmenuChange.emit(this.isSubmenu); 
  }

  logout() {
    this.isSubmenu = false;
    this.isSubmenuChange.emit(this.isSubmenu);
    this.router.navigate(['/login']);
  }
}
