import { Routes } from '@angular/router';
import {Body} from './auth/body/body';
import {Signin} from './auth/signin/signin';
import {Signup} from './auth/signup/signup';
import {Forgetpassword} from './auth/forgetpassword/forgetpassword';
import {Layout} from './home/layout/layout';

export const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  {path: 'auth',  component: Body , children: [
      {path: 'login', component: Signin},
      {path: 'signup', component: Signup},
      {path: 'forgetpassword', component: Forgetpassword },
    ]},
  {path: 'dashboard', component: Layout, children: [

    ]}
  // { path: '**', redirectTo: 'auth/login' }
];
