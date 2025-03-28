import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-legal-notice',
  standalone: true,
  imports: [],
  templateUrl: './legal-notice.component.html',
  styleUrl: './legal-notice.component.scss'
})
export class LegalNoticeComponent {

  constructor(
    private _location: Location, 
    private titleService:Title,
    private sharedService: SharedService
  ) {
    this.titleService.setTitle("Join - Legal notice");
    this.sharedService.setIsLoginWindow(false);
  }

  back() {
    this._location.back();
  }
}