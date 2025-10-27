import {Component, OnInit} from '@angular/core';
import {DatePipe, NgClass, NgIf} from '@angular/common';
import {Profile} from '../profile/profile';
import {TranslatePipe} from '@ngx-translate/core';
import {Shared} from '../../../services/shared';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ApiResponse, User} from '../../../services/models';
import {DatePicker} from 'primeng/datepicker';
import {Dialog} from 'primeng/dialog';
import {NotificationDetails} from '../notification-details/notification-details';
import {ResetPassword} from '../../../auth/reset-password/reset-password';
import {UploadFileDialog} from '../upload-file-dialog/upload-file-dialog';
import {OrderChart} from '../order-chart/order-chart';
import {PublicService} from '../../../services/public-service';

@Component({
  selector: 'app-manage-profile',
  imports: [
    NgIf,
    Profile,
    TranslatePipe,
    ReactiveFormsModule,
    DatePicker,
    Dialog,
    ResetPassword,
    UploadFileDialog,
    OrderChart,
    NgClass,
  ],
  templateUrl: './manage-profile.html',
  styleUrl: './manage-profile.scss'
})
export class ManageProfile implements OnInit {
  isSaveButtonClicked: boolean = false;
  formGroup: FormGroup = new FormGroup({});
  user!: User;
  showSaveButton: boolean = false;
  doChangePassword: boolean = false;
  doChangeProfilePicture: boolean = false;
  doShowOrderChart: boolean = false;
  constructor(public sharedService: Shared, private formBuilder: FormBuilder,private publicService: PublicService) {
  }

  ngOnInit(): void {
        if(this.sharedService.principal) {
          this.user = structuredClone(this.sharedService.principal);
          this.initForms();
        }
    }

  initForms(){
    this.formGroup = this.formBuilder.group({
      email: [{ value: this.user.email, disabled: true }, [Validators.required, Validators.email]],
      firstname: [this.user.firstname, [Validators.required]],
      lastname: [this.user.lastname, [Validators.required]],
      dateOfBirth: [this.user?.dateOfBirth ? new Date(this.user.dateOfBirth): new Date(new Date().setFullYear(new Date().getFullYear() - 20)), [Validators.required]],
      degree: [this.user.degree, [Validators.required]],
      title: [this.user.title, [Validators.required]],
      address: [this.user.address, [Validators.required]],
      city: [this.user.city, [Validators.required]],
      country: [this.user.country, [Validators.required]],
      postCode: [this.user.postCode, [Validators.required]],
    })
  }

  setUserDetails(){
    this.user.email = this.formGroup.controls['email'].value == '' ? null : this.formGroup.controls['email'].value;
    this.user.firstname = this.formGroup.controls['firstname'].value == '' ? null : this.formGroup.controls['firstname'].value;
    this.user.lastname = this.formGroup.controls['lastname'].value == '' ? null : this.formGroup.controls['lastname'].value;
    this.user.dateOfBirth = new Date(this.formGroup.controls['dateOfBirth'].value)?.getTime();
    this.user.degree = this.formGroup.controls['degree'].value == '' ? null : this.formGroup.controls['degree'].value;
    this.user.title = this.formGroup.controls['title'].value == '' ? null : this.formGroup.controls['title'].value;
    this.user.address = this.formGroup.controls['address'].value == '' ? null : this.formGroup.controls['address'].value;
    this.user.city = this.formGroup.controls['city'].value == '' ? null : this.formGroup.controls['city'].value;
    this.user.country = this.formGroup.controls['country'].value == '' ? null : this.formGroup.controls['country'].value;
    this.user.postCode = this.formGroup.controls['postCode'].value == '' ? null : this.formGroup.controls['postCode'].value;
    this.showSaveButton = !this.isDeeplyEquals();
  }

  setPrincipal(newUser: User){
    if(newUser){
      this.user = newUser;
      this.sharedService.principal = newUser;
    }
  }

  isDeeplyEquals(): boolean{
    return JSON.stringify(this.user) === JSON.stringify(this.sharedService.principal);
  }

  get canChangePassword(): boolean {
    if(this.sharedService.principal){
      let lastReset = new Date(this.sharedService.principal.lastPasswordResetDate);
      let oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      return lastReset > oneHourAgo;
    } else return false;
  }

  saveChanges(){
    this.isSaveButtonClicked = true
    if(this.formGroup.invalid) return;

    this.publicService.setProfileDetails( this.formGroup.getRawValue() ).subscribe({
      next: (apiResponse: ApiResponse) => {
        if(apiResponse.success){
          if(this.sharedService.principal?.email == apiResponse.data.email) {
            this.sharedService.principal = apiResponse.data;
            this.showSaveButton = !this.isDeeplyEquals();
          }
        }
      },
      error: (err)=> { console.error(err)}
    })

  }
}
