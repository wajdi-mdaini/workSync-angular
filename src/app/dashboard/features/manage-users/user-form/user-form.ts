import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DatePicker} from "primeng/datepicker";
import {Dialog} from "primeng/dialog";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgClass, NgIf} from "@angular/common";
import {OrderChart} from "../../order-chart/order-chart";
import {Profile} from "../../profile/profile";
import {ResetPassword} from "../../../../auth/reset-password/reset-password";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {UploadFileDialog} from "../../upload-file-dialog/upload-file-dialog";
import {Shared} from '../../../../services/shared';
import {ApiResponse, EditUserRequest, Role, Team, User, UserDTO} from '../../../../services/models';
import {ManagerService} from '../../../../services/manager-service';
import {Select} from 'primeng/select';

@Component({
  selector: 'app-user-form',
  imports: [
    DatePicker,
    Dialog,
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    TranslatePipe,
    NgClass,
    Select
  ],
  templateUrl: './user-form.html',
  styleUrl: './user-form.scss'
})
export class UserForm implements OnInit {
  isAdmin: boolean = true;
  isSaveButtonClicked: boolean = false;
  formGroup: FormGroup = new FormGroup({});
  @Input() userToEdit: User = {} as User;
  @Output() editUserInList = new EventEmitter<User>();
  user: User = {} as User;
  @Input() showDialog: boolean = false;
  @Output() showDialogChange = new EventEmitter<boolean>();
  showSaveButton: boolean = false;
  teams: Team[] = [];
  constructor(public sharedService: Shared,
              private formBuilder: FormBuilder,
              private managerService: ManagerService,
              private translate: TranslateService) {
  }

  ngOnInit(): void {
    this.initTeamsList()
    this.user = structuredClone(this.userToEdit);
    this.initForms();
  }

  initTeamsList() {
    this.managerService.getCompanyTeams(this.sharedService.company.id).subscribe({
      next: (apiResponse: ApiResponse) => {
        this.teams = apiResponse.data;
      },
      error: err => { console.error(err); }
    })
  }
  initForms(){
    this.isAdmin = this.user?.role == Role.ADMIN;
    this.formGroup = this.formBuilder.group({
      email: [{ value: this.userToEdit?.email, disabled: this.user.email != null }, [Validators.required, Validators.email]],
      firstname: [this.user?.firstname, [Validators.required]],
      lastname: [this.user?.lastname, [Validators.required]],
      dateOfBirth: [this.user?.dateOfBirth ? new Date(this.user?.dateOfBirth): new Date(new Date().setFullYear(new Date().getFullYear() - 20)), [Validators.required]],
      degree: [this.user?.degree, [Validators.required]],
      title: [this.user?.title, [Validators.required]],
      address: [this.user?.address, [Validators.required]],
      city: [this.user?.city, [Validators.required]],
      country: [this.user?.country, [Validators.required]],
      postCode: [this.user?.postCode, [Validators.required]],
      team: [this.user?.team],
    })
  }

  setUserDetails(){
    this.user.email = this.formGroup.controls['email'].value == '' ? null : this.formGroup.controls['email'].value;
    this.user.firstname = this.formGroup.controls['firstname'].value == '' ? null : this.formGroup.controls['firstname'].value;
    this.user.lastname = this.formGroup.controls['lastname'].value == '' ? null : this.formGroup.controls['lastname'].value;
    this.user.degree = this.formGroup.controls['degree'].value == '' ? null : this.formGroup.controls['degree'].value;
    this.user.title = this.formGroup.controls['title'].value == '' ? null : this.formGroup.controls['title'].value;
    this.user.address = this.formGroup.controls['address'].value == '' ? null : this.formGroup.controls['address'].value;
    this.user.city = this.formGroup.controls['city'].value == '' ? null : this.formGroup.controls['city'].value;
    this.user.country = this.formGroup.controls['country'].value == '' ? null : this.formGroup.controls['country'].value;
    this.user.postCode = this.formGroup.controls['postCode'].value == '' ? null : this.formGroup.controls['postCode'].value;
    this.user.team = this.formGroup.get('team')?.value;
    this.user.role = this.isAdmin ? Role.ADMIN : Role.EMPLOYEE;
    this.showSaveButton = !this.isDeeplyEquals();
  }

  setDateOfBirth(){
    this.user.dateOfBirth = new Date(this.formGroup.controls['dateOfBirth'].value)?.getTime();
    if(this.userToEdit.dateOfBirth == null &&
      new Date(this.user.dateOfBirth)?.setHours(0,0,0,0) == new Date(new Date().setFullYear(new Date().getFullYear() - 20)).setHours(0,0,0,0))
      this.user.dateOfBirth = null
    this.showSaveButton = !this.isDeeplyEquals();
  }

  isDeeplyEquals(): boolean{
    return JSON.stringify(this.user) === JSON.stringify(this.userToEdit);
  }

  hideDialog(){
    this.showDialog = false;
    this.showDialogChange.emit(false);
  }

  saveChanges(){
    this.isSaveButtonClicked = true;
    if(this.formGroup.invalid) return;

    let isEditRequest: boolean = false;
    if(this.userToEdit.email != null) isEditRequest = true;

    let editUserRequest: EditUserRequest = {
      editRequest: isEditRequest,
      userDTO: this.getUser
    }
    this.managerService.editUser(editUserRequest).subscribe({
      next: (response: ApiResponse) => {
        if(response.success){
          this.userToEdit = response.data;
          this.user = response.data;
          this.editUserInList.emit(response.data);
          this.showDialog = false;
        }
      },
      error: (err) => {console.log(err)},
    })
  }

  get getUser(): UserDTO{
    let user: UserDTO = {} as UserDTO;
    user.firstname = this.formGroup.get('firstname')?.value;
    user.email = this.formGroup.get('email')?.value;
    user.lastname = this.formGroup.get('lastname')?.value;
    user.dateOfBirth = new Date(this.formGroup.get('dateOfBirth')?.value).getTime();
    user.address = this.formGroup.get('address')?.value;
    user.city = this.formGroup.get('city')?.value;
    user.country = this.formGroup.get('country')?.value;
    user.postCode = this.formGroup.get('postCode')?.value;
    user.degree = this.formGroup.get('degree')?.value;
    user.title = this.formGroup.get('title')?.value;
    user.teamId = this.formGroup.get('team')?.value?.id;
    user.role = this.user.role;

    return user;
  }

  protected readonly Role = Role;
}
