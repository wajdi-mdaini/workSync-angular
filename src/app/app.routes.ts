import { Routes } from '@angular/router';
import {Body} from './auth/body/body';
import {Signin} from './auth/signin/signin';
import {Signup} from './auth/signup/signup';
import {Forgetpassword} from './auth/forgetpassword/forgetpassword';
import {authGuard} from './services/auth-guard';
import {WelcomePage} from './dashboard/features/welcome-page/welcome-page';
import {FirstLogin} from './auth/first-login/first-login';
import {NotificationsList} from './dashboard/features/notifications-list/notifications-list';
import {Profile} from './dashboard/features/profile/profile';
import {NotificationDetails} from './dashboard/features/notification-details/notification-details';
import {ManageProfile} from './dashboard/features/manage-profile/manage-profile';


export const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  {path: 'auth',  component: Body , children: [
      {path: 'login', component: Signin},
      {path: 'signup', component: Signup},
      {path: 'forgetpassword', component: Forgetpassword},
      {path: 'firstlogin', component: FirstLogin},
    ]},
  {path: 'home', loadComponent: () => import('./home/layout/layout').then(m => m.Layout) ,canActivate: [authGuard],
    children: []},
  {path: 'dashboard', loadComponent: () => import('./dashboard/layout/layout').then(m => m.Layout) ,canActivate: [authGuard],
    children: [
      {path: '', component: WelcomePage},
      {path: 'notifications', component: NotificationsList},
      {path: 'profile', component: ManageProfile},
    ]}


  // { path: '**', redirectTo: 'auth/login' }
];
