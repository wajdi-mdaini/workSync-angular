import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {TranslatePipe} from '@ngx-translate/core';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../services/auth-service';
import {ApiResponse, LoginRequest, Role, User} from '../../services/models';
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
export class Signin implements OnInit {
  formGroup: FormGroup =  new FormGroup({});
  loginClicked: boolean = false;
  wrongCritical: boolean = false;
  blockedUser: boolean = false;
  isRememberMe: boolean = false;
  constructor(private authService: AuthService,private formBuilder: FormBuilder,private router: Router,private sharedService: Shared) {
  }

  ngOnInit(): void {
      this.initForm();
      if (typeof window !== 'undefined' && localStorage) {
        let email = localStorage.getItem('userEmail')
        if (email) {
          this.isRememberMe = true;
          this.formGroup.get('email')?.setValue(email);
        }
      }
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
            this.setStoredEmail();
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
  setStoredEmail(){
    let emailValue = (this.formGroup.get('email')?.value)?.trim();
    this.isRememberMe ?
                        (emailValue!= null && emailValue!=''? localStorage.setItem('userEmail',this.formGroup.get('email')?.value) : null ) :
                        localStorage.removeItem('userEmail');
  }
}
