import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule, NgClass} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {AuthService} from '../../services/auth-service';
import {ApiResponse, ChangePasswordRequest} from '../../services/models';
import {PasswordService} from '../../services/PasswordService';
import { format } from 'date-fns';
import {Router} from '@angular/router';
import {MessageService} from 'primeng/api';
import {PublicService} from '../../services/public-service';
import {Shared} from '../../services/shared';

@Component({
  selector: 'app-reset-password',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslatePipe,
    FormsModule,
    NgClass
  ],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss'
})
export class ResetPassword {
  @Input() useCurrentPassword: boolean = false;
  @Input() redirectionPath: string = '/auth/login';
  @Input() passwordLength: number = 8;
  @Output() isChanged = new EventEmitter<boolean>();
  password: string = '';
  confirmPassword: string = '';
  currentPassword: string = '';
  passwordsMatch: boolean = true;
  wrongCurrentPassword: boolean = false;
  conditions = {
    minLength: false,
    upperCase: false,
    lowerCase: false,
    number: false,
    specialChar: false
  };
  resetPasswordButtonSubmitted: boolean = false;
  constructor(private router: Router,
              private authService: AuthService,
              private passwordService: PasswordService,
              private sharedService: Shared,
              private publicService: PublicService) {
  }
  validatePassword() {
    const pwd = this.password;

    this.conditions.minLength   = pwd.length >= this.passwordLength;
    this.conditions.upperCase   = /[A-Z]/.test(pwd);
    this.conditions.lowerCase   = /[a-z]/.test(pwd);
    this.conditions.number      = /\d/.test(pwd);
    this.conditions.specialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
    this.validateConfirmPassword();
  }

  validateConfirmPassword() {
    this.passwordsMatch = this.password === this.confirmPassword;
  }

  validateCurrentPassword(){

  }

  resetPassword() {
    this.resetPasswordButtonSubmitted = true;
    if(this.useCurrentPassword){
      this.publicService.checkCurrentPassword(this.currentPassword,this.sharedService.principal?.email).subscribe({
        next: (apiResponse: ApiResponse) => {
          if(apiResponse.success){
            this.wrongCurrentPassword = false;
            this.doReset();
          }else{
            this.wrongCurrentPassword = true;
          }
        },
        error: err => { console.log(err); }
      })
    }else{
      this.doReset();
    }
  }

  doReset(){
    if (this.passwordsMatch && this.isCorrectPassword) {
      let today = new Date();
      let changePasswordRequest: ChangePasswordRequest = {
        password: this.passwordService.encodePassword(this.password),
        lastPasswordResetDate: format(today, 'yyyy-MM-dd')
      }
      this.authService.changePassword(changePasswordRequest).subscribe({
        next: (response: ApiResponse) => {
          if(response){
            this.isChanged.emit(true);
            console.log('Password changed successfully');
            if(this.redirectionPath == 'dashboard')
            this.sharedService.customNavigation(this.redirectionPath,'navbar_screen_title_dashboard');
            else if(this.redirectionPath == 'home')
              this.sharedService.customNavigation(this.redirectionPath,'navbar_screen_title_home');
            else this.sharedService.customNavigation(this.redirectionPath);

          }
        },
        error: (error) => {
          console.error('Error changing password', error);
        }
      });
    }
  }
  get isCorrectPassword(): boolean {
    return this.conditions.minLength &&
      this.conditions.upperCase &&
      this.conditions.lowerCase &&
      this.conditions.number &&
      this.conditions.specialChar;
  }

  get isWrongPassword(): boolean {
    return !this.conditions.minLength ||
      !this.conditions.upperCase ||
      !this.conditions.lowerCase ||
      !this.conditions.number ||
      !this.conditions.specialChar;
  }
}
