import { Component } from '@angular/core';
import {Location} from '@angular/common';

@Component({
  selector: 'app-help-page',
  standalone: true,
  imports: [],
  templateUrl: './help-page.component.html',
  styleUrl: './help-page.component.scss'
})
export class HelpPageComponent {

  constructor(private _location: Location) {}

  back() {
    this._location.back();
  }
}
