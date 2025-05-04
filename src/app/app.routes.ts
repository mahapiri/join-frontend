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
import { authGuard } from './guards/auth.guard';
import { PublicNoticesComponent } from './public-notices/public-notices.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    {
        path: 'public-notices',
        component: PublicNoticesComponent,
    },
    {
        path: 'summary',
        component: SummaryComponent,
        canActivate: [authGuard]
    },
    {
        path: 'add-task',
        component: AddTaskComponent,
        canActivate: [authGuard]
    },
    {
        path: 'board',
        component: BoardComponent,
        canActivate: [authGuard]
    },
    {
        path: 'contacts',
        component: ContactsComponent,
        canActivate: [authGuard]
    },
    {
        path: 'privacy-policy',
        component: PrivacyPolicyComponent,
        canActivate: [authGuard]
    },
    {
        path: 'legal-notice',
        component: LegalNoticeComponent,
        canActivate: [authGuard]
    },
    {
        path: 'help',
        component: HelpPageComponent,
        canActivate: [authGuard]
    },
    { path: '**', redirectTo: 'login' },
];
