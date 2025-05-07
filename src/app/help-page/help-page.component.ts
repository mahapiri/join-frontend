import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-help-page',
  standalone: true,
  imports: [],
  templateUrl: './help-page.component.html',
  styleUrls: [
    './help-page.component.scss',
    './help-page-responsive.component.scss',
  ]
})
export class HelpPageComponent {

  constructor(
    private _location: Location, 
    private titleService: Title,
    private sharedService: SharedService
  ) {
    this.titleService.setTitle("Join - Help");
  }

  back() {
    this._location.back();
  }
}
