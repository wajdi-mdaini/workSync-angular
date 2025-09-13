import { Component } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';
import {RouterLink} from '@angular/router';
import { InputOtpModule } from 'primeng/inputotp';
import { ButtonModule } from 'primeng/button';
import {Shared} from '../../services/shared';
import {CommonModule} from '@angular/common';
import {ResetPassword} from '../reset-password/reset-password';
import {AuthService} from '../../services/auth-service';
import {interval, Subscription} from 'rxjs';
import {ApiResponse} from '../../services/models';
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
  email: string = '';
  verificationCode: string = '';
  fullName: string = '';
  isFirstStep: boolean = true;
  isSecondStep: boolean = false;
  isThirdStep: boolean = false;
  wrongCodeError: boolean = false;
  minutesLeft: number = 1;
  secondsLeft: number = 0;
  private timerSubscription!: Subscription;
  constructor(public sharedStore: Shared,private authService: AuthService) {}
  getVerificationCode(){
    this.authService.getVerificationCode(this.email).subscribe( {
      next: ( apiResponse: ApiResponse ) => {
        if(apiResponse.success){
          this.isFirstStep = false;
          this.isSecondStep = true;
          this.fullName = apiResponse.data;
          this.minutesLeft = this.sharedStore.sharedSettings.verificationCodeExpireIn;
          this.secondsLeft = 0;
          this.startTimer(this.minutesLeft * 60)
        }
      },
      error: (err) => console.error('Error email sending', err)
    });
  }

  startTimer(durationInSeconds: number) {
    let timeLeft = durationInSeconds;
    this.timerSubscription = interval(1000).subscribe(() => {
      if (timeLeft > 0) {
        timeLeft--;
        this.minutesLeft = Math.floor(timeLeft / 60);
        this.secondsLeft = timeLeft % 60;
      } else {
        this.timerSubscription.unsubscribe();
        console.error('Verification code has expired!');
      }
    });
  }
  checkVerificationCode(){
    if(this.verificationCode.length >= this.sharedStore.sharedSettings.verificationCodeLength){
      this.authService.checkVerificationCode(
        this.verificationCode.substring(0,this.sharedStore.sharedSettings.verificationCodeLength)
      ).subscribe({
      next:(apiResponse:ApiResponse) => {
        if (apiResponse.success) {
          this.timerSubscription.unsubscribe();
          this.isSecondStep = false;
          this.isThirdStep = true;
          this.wrongCodeError = false
        }
      }, error: (err) => {
          if(err.error?.status == "UNAUTHORIZED"){
            this.wrongCodeError = true;
          }
        }
    });
    }
  }

  get verificationCodeHasExpired(){
    return this.minutesLeft == 0 && this.secondsLeft == 0
  }
}
