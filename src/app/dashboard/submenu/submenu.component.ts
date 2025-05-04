import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SharedService } from '../../services/shared.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-submenu',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './submenu.component.html',
  styleUrl: './submenu.component.scss'
})
export class SubmenuComponent {
  @Input() isSubmenu: boolean = false;
  @Output() isSubmenuChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private router: Router,
    private sharedService: SharedService,
    private userService: UserService
  ) { }


  toggleSubmenu() {
    this.isSubmenu = !this.isSubmenu;
    this.isSubmenuChange.emit(this.isSubmenu);
  }


  logout() {
    this.isSubmenu = false;
    this.isSubmenuChange.emit(this.isSubmenu);
    this.sharedService.setisDisableAnimation(false);
    this.sharedService.siteIsLoading(true);
    this.userService.deletetoken();
    this.userService.setIsLoggedIn(false);
    this.router.navigate(['/login']);
  }
}
