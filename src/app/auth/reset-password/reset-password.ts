import {Component, Input} from '@angular/core';
import {CommonModule, NgClass} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {AuthService} from '../../services/auth-service';
import {ApiResponse, ChangePasswordRequest} from '../../services/models';
import {PasswordService} from '../../services/PasswordService';
import { format } from 'date-fns';
import {Router} from '@angular/router';
import {MessageService} from 'primeng/api';

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
  password: string = '';
  confirmPassword: string = '';
  currentPassword: string = '';
  passwordsMatch: boolean = true;
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
              private messageService: MessageService,
              private translate: TranslateService) {
  }
  validatePassword() {
    const pwd = this.password;

    this.conditions.minLength   = pwd.length >= 8;
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
    if (this.passwordsMatch && this.isCorrectPassword) {
      let today = new Date();
      let changePasswordRequest: ChangePasswordRequest = {
        password: this.passwordService.encodePassword(this.password),
        lastPasswordResetDate: format(today, 'yyyy-MM-dd')
      }
      this.authService.changePassword(changePasswordRequest).subscribe({
        next: (response: ApiResponse) => {
          if(response){
            console.log('Password changed successfully');
            this.router.navigate([this.redirectionPath]);
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
