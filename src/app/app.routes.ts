import { Routes } from '@angular/router';
import { SummaryComponent } from './summary/summary.component';
import { AddTaskComponent } from './add-task/add-task.component';
import { BoardComponent } from './board/board.component';
import { ContactsComponent } from './contacts/contacts.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { LegalNoticeComponent } from './legal-notice/legal-notice.component';
import { HelpPageComponent } from './help-page/help-page.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

export const routes: Routes = [
    { path: '', component: LoginComponent},
    { path: 'login', component: LoginComponent},
    { path: 'signup', component: SignupComponent},
    { path: 'summary', component: SummaryComponent},
    { path: 'add-task', component: AddTaskComponent},
    { path: 'board', component: BoardComponent},
    { path: 'contacts', component: ContactsComponent},
    { path: 'privacy-policy', component: PrivacyPolicyComponent},
    { path: 'legal-notice', component: LegalNoticeComponent},
    { path: 'help', component: HelpPageComponent},
];
