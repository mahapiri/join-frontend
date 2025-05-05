import { Component } from '@angular/core';
import { SharedService } from '../services/shared.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './logo.component.html',
  styleUrls: [
    './logo.component.scss',
    './logo-responsive.component.scss',
  ]
})
export class LogoComponent {

  constructor(
    public sharedService: SharedService,
    private router: Router
  ) {}

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
