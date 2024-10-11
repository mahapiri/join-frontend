import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SummaryComponent } from './summary/summary.component';
import { AddTaskComponent } from './add-task/add-task.component';
import { BoardComponent } from './board/board.component';
import { ContactsComponent } from './contacts/contacts.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { LegalNoticeComponent } from './legal-notice/legal-notice.component';
import { HelpPageComponent } from './help-page/help-page.component';

export const routes: Routes = [
    { path: 'summary', component: SummaryComponent},
    { path: 'add-task', component: AddTaskComponent},
    { path: 'board', component: BoardComponent},
    { path: 'contacts', component: ContactsComponent},
    { path: 'privacy-policy', component: PrivacyPolicyComponent},
    { path: 'legal-notice', component: LegalNoticeComponent},
    { path: 'help', component: HelpPageComponent},
];
