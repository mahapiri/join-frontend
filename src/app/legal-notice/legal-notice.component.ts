import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-legal-notice',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './legal-notice.component.html',
  styleUrls: [
    './legal-notice.component.scss',
    './legal-notice-responsive.component.scss'
  ]
})
export class LegalNoticeComponent {

  constructor(
    private _location: Location, 
    private titleService:Title,
    public sharedService: SharedService
  ) {
    this.titleService.setTitle("Join - Legal notice");
  }

  back() {
    this._location.back();
  }
}