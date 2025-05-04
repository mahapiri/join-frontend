import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss'
})
export class PrivacyPolicyComponent {
  constructor(
    private _location: Location, 
    private titleService: Title,
    private sharedService: SharedService,
  ) {
    this.titleService.setTitle("Join - Privacy Policy");
  }

  back() {
    this._location.back();
    this.sharedService.setisDisableAnimation(true);
  }
}
