import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-help-page',
  standalone: true,
  imports: [],
  templateUrl: './help-page.component.html',
  styleUrl: './help-page.component.scss'
})
export class HelpPageComponent {

  constructor(private _location: Location, private titleService: Title) {
    this.titleService.setTitle("Join - Help");
  }

  back() {
    this._location.back();
  }
}
