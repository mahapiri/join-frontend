import { Component } from '@angular/core';
import { PrivacyPolicyComponent } from '../privacy-policy/privacy-policy.component';
import { LegalNoticeComponent } from '../legal-notice/legal-notice.component';
import { SharedService } from '../services/shared.service';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-public-notices',
  standalone: true,
  imports: [
    PrivacyPolicyComponent,
    LegalNoticeComponent,
    RouterLink,
    RouterModule,
    CommonModule
  ],
  templateUrl: './public-notices.component.html',
  styleUrl: './public-notices.component.scss'
})
export class PublicNoticesComponent {
  privacy: boolean = true;

  constructor(
    private sharedService : SharedService,
    private router : Router
  ) {
    this.sharedService.hideLogo = true;
  }


  navigateToLoginPage() {
    this.router.navigate(['/login']);
    this.sharedService.hideLogo = false;
    this.sharedService.setisDisableAnimation(true);
  }

  showLegalNotice(isPrivacy: boolean) {
    this.privacy = isPrivacy;
  }
}
