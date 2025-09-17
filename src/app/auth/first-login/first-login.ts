import { Component } from '@angular/core';
import {ResetPassword} from '../reset-password/reset-password';

@Component({
  selector: 'app-first-login',
  imports: [
    ResetPassword
  ],
  templateUrl: './first-login.html',
  styleUrl: './first-login.scss'
})
export class FirstLogin {

}
