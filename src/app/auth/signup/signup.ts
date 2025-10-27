import { Component } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../services/auth-service';
import {MessageService} from 'primeng/api';
import {ApiResponse, SignUpRequest} from '../../services/models';
import {NgClass, NgIf} from '@angular/common';

@Component({
  selector: 'app-signup',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TranslatePipe,
    RouterLink,
    NgClass,
    NgIf
  ],
  templateUrl: './signup.html',
  styleUrl: './signup.scss'
})
export class Signup {
  isSignedUp: boolean = false;
  usedEmail: boolean = false;
  usedCompanyName: boolean = false;
  userFormGroup: FormGroup = new FormGroup({});
  companyFormGroup: FormGroup = new FormGroup({});
  constructor(private router: Router,
              private authService: AuthService,
              private formBuilder: FormBuilder) {
    this.initForms();
  }
  initForms(){
    this.userFormGroup = this.formBuilder.group({
      firstname: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.email,Validators.required])
    })
    this.companyFormGroup = this.formBuilder.group({
      name: new FormControl('', [Validators.required])
    })
  }
  signUp(){
    this.isSignedUp = true;
    if(this.userFormGroup.invalid || this.companyFormGroup.invalid) return;
    let signUpRequest: SignUpRequest = {
      user : this.userFormGroup.value,
      company : this.companyFormGroup.value
    }
    this.authService.signUp(signUpRequest).subscribe({
      next: (result: ApiResponse)=> {
        this.router.navigate(['/auth/login']);
      },
      error: ()=> {
        console.error('Error signing up');
      }
    })
  }
}
