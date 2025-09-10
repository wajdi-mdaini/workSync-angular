import { Component } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';
import {RouterLink} from '@angular/router';
import { InputOtpModule } from 'primeng/inputotp';
import { ButtonModule } from 'primeng/button';
import {Shared} from '../../services/shared';
import {CommonModule} from '@angular/common';
import {ResetPassword} from '../reset-password/reset-password';
@Component({
  selector: 'app-forgetpassword',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslatePipe,
    RouterLink,
    InputOtpModule,
    ButtonModule,
    ResetPassword,
  ],
  templateUrl: './forgetpassword.html',
  styleUrl: './forgetpassword.scss'
})
export class Forgetpassword {
  verificationCode: string = '';

  constructor(public sharedStore: Shared) {}


}
