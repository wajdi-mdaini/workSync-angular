import { Routes } from '@angular/router';
import {Body} from './auth/body/body';
import {Signin} from './auth/signin/signin';
import {Signup} from './auth/signup/signup';
import {Forgetpassword} from './auth/forgetpassword/forgetpassword';
import {authGuard} from './services/auth-guard';
import {WelcomePage} from './dashboard/features/welcome-page/welcome-page';
import {FirstLogin} from './auth/first-login/first-login';
import {NotificationsList} from './dashboard/features/notifications-list/notifications-list';
import {ManageProfile} from './dashboard/features/manage-profile/manage-profile';
import {ManageCompany} from './dashboard/features/manage-company/manage-company';
import {ManageTeams} from './dashboard/features/manage-teams/manage-teams';
import {Profile} from './home/features/profile/profile';
import {ManageUsers} from './dashboard/features/manage-users/manage-users';
import {ManageDocument} from './dashboard/features/manage-document/manage-document';
import {WlecomPage} from './home/wlecom-page/wlecom-page';
import {Documents} from './home/features/documents/documents';
import {Notifications} from './home/features/notifications/notifications';
import {Events} from './home/features/events/events';
import {Holiday} from './home/features/holiday/holiday';
import {ManageHolidays} from './dashboard/features/manage-holidays/manage-holidays';


export const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  {path: 'auth',  component: Body , children: [
      {path: 'login', component: Signin},
      {path: 'signup', component: Signup},
      {path: 'forgetpassword', component: Forgetpassword},
      {path: 'firstlogin', component: FirstLogin, canActivate: [authGuard]},
    ]},
  {path: 'home', loadComponent: () => import('./home/layout/layout').then(m => m.Layout) ,canActivate: [authGuard],
    children: [
      {path: '', component: WlecomPage},
      {path: 'profile', component: Profile},
      {path: 'documents', component: Documents},
      {path: 'notifications', component: Notifications},
      {path: 'holidays', component: Holiday},
      {path: 'events', component: Events},
    ]},
  {path: 'dashboard', loadComponent: () => import('./dashboard/layout/layout').then(m => m.Layout) ,canActivate: [authGuard],
    children: [
      {path: '', component: WelcomePage},
      {path: 'notifications', component: NotificationsList},
      {path: 'profile', component: ManageProfile},
      {path: 'company', component: ManageCompany},
      {path: 'teams', component: ManageTeams},
      {path: 'users', component: ManageUsers},
      {path: 'documents', component: ManageDocument},
      {path: 'holidays', component: ManageHolidays},
    ]}


  // { path: '**', redirectTo: 'auth/login' }
];
