import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-legal-notice',
  standalone: true,
  imports: [],
  templateUrl: './legal-notice.component.html',
  styleUrl: './legal-notice.component.scss'
})
export class LegalNoticeComponent {

  constructor(private _location: Location, private titleService:Title) {
    this.titleService.setTitle("Join - Legal notice")
  }

  back() {
    this._location.back();
  }
}