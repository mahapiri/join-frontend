import { Component } from '@angular/core';
import { PrivacyPolicyComponent } from '../privacy-policy/privacy-policy.component';
import { LegalNoticeComponent } from '../legal-notice/legal-notice.component';
import { SharedService } from '../services/shared.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-public-notices',
  standalone: true,
  imports: [
    PrivacyPolicyComponent,
    LegalNoticeComponent,
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
    private router : Router,
    private titleService: Title,
    private route: ActivatedRoute
  ) {
    this.titleService.setTitle("Join - Legal Notices");
    this.sharedService.setSiteviewer(true);
    this.sharedService.siteIsLoading(false);

    this.getURLParams();
  }


  getURLParams() {
    const type = this.route.snapshot.paramMap.get('type');

    if(type === 'privacy-policy') {
      this.privacy = true;
    } else if (type === 'legal-notice') {
      this.privacy = false;
    } else {
      this.navigateToLoginPage();
    }
  }


  navigateToLoginPage() {
    this.router.navigate(['/login']);
    this.sharedService.setSiteviewer(false);
    this.sharedService.setisDisableAnimation(false);
    this.sharedService.siteIsLoading(true);
  }

  showLegalNotice(isPrivacy: boolean) {
    this.privacy = isPrivacy;
  }
}
