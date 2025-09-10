import {Component, Input} from '@angular/core';
import {CommonModule, NgClass} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TranslatePipe} from "@ngx-translate/core";

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
}
