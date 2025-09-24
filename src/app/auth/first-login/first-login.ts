import { Component } from '@angular/core';
import {ResetPassword} from '../reset-password/reset-password';
import {Role} from '../../services/models';
import {Shared} from '../../services/shared';

@Component({
  selector: 'app-first-login',
  imports: [
    ResetPassword
  ],
  templateUrl: './first-login.html',
  styleUrl: './first-login.scss'
})
export class FirstLogin {

  constructor(private sharedService: Shared) {
  }
  get getRedirectionPath(): string {
    if(this.sharedService.principal?.role == Role.ADMIN || this.sharedService.principal?.role == Role.MANAGER)
      return 'dashboard'
    else
      return 'home'
  }
}
