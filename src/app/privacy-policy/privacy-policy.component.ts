import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './privacy-policy.component.html',
  styleUrls: [
    './privacy-policy.component.scss',
    './privacy-policy-responsive.component.scss',
  ]
})
export class PrivacyPolicyComponent {
  constructor(
    private _location: Location,
    private titleService: Title,
    public sharedService: SharedService,
  ) {
    this.titleService.setTitle("Join - Privacy Policy");
  }

  back() {
    this._location.back();
    this.sharedService.setisDisableAnimation(true);
  }
}
