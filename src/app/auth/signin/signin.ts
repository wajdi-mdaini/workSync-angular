import { Component } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {TranslatePipe} from '@ngx-translate/core';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../services/auth-service';
import {ApiResponse, LoginRequest, LoginResponse, Role, SharedSettings, User} from '../../services/models';
import {NgClass, NgIf} from '@angular/common';
import {Shared} from '../../services/shared';

@Component({
  selector: 'app-signin',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TranslatePipe,
    RouterLink,
    NgClass,
    NgIf
  ],
  templateUrl: './signin.html',
  styleUrl: './signin.scss'
})
export class Signin {
  formGroup: FormGroup =  new FormGroup({});
  loginClicked: boolean = false;
  wrongCritical: boolean = false;
  blockedUser: boolean = false;
  constructor(private authService: AuthService,private formBuilder: FormBuilder,private router: Router,private sharedService: Shared) {
    this.initForm();
  }
  initForm(){
    this.formGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })
  }
  doLogin(){
    this.loginClicked = true;
    this.blockedUser = false;
    this.wrongCritical = false;
    if(this.formGroup.invalid){
      return;
    }
    let loginRequest: LoginRequest = {
      email: this.formGroup.get('email')!.value,
      password: this.formGroup.get('password')!.value
    }
    this.authService.login(loginRequest).subscribe({
      next: (apiResponse: ApiResponse) => {
        if (apiResponse.success){
          let user: User = apiResponse.data?.user;
            this.blockedUser = false;
            this.wrongCritical = false;
            this.sharedService.principal = user;
            localStorage.setItem('jwt', apiResponse.data?.token);
            if(user.role == Role.ADMIN || user.role == Role.MANAGER){
              this.router.navigate(['dashboard']);
            }
            else this.router.navigate(['home']);
        }
    }
    ,error: (err) => {
        console.error('Error fetching user', err)
          if(err.error?.status == "UNAUTHORIZED"){
            this.wrongCritical = true;
          }else if(err.error?.status == "LOCKED"){
            this.blockedUser = true;
          }
        }
  })
  }
}
