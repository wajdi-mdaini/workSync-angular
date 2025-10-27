import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgClass, NgIf} from "@angular/common";
import {TranslatePipe} from "@ngx-translate/core";
import {ApiResponse, Company} from '../../../services/models';
import {Shared} from '../../../services/shared';
import {IftaLabel} from 'primeng/iftalabel';
import {Textarea} from 'primeng/textarea';
import {CompanyService} from '../../../services/company-service';

@Component({
  selector: 'app-manage-company',
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    TranslatePipe,
    NgClass,
    IftaLabel,
    Textarea
  ],
  templateUrl: './manage-company.html',
  styleUrl: './manage-company.scss'
})
export class ManageCompany implements OnInit {
  isSaveButtonClicked: boolean = false;
  disableSaveButton: boolean = true;
  formGroup: FormGroup = new FormGroup({});
  company!: Company;

  constructor(private formBuilder: FormBuilder,
              private sharedService: Shared,
              private companyService: CompanyService) {
  }

  ngOnInit(): void {
    if(this.sharedService.principal) {
      this.company = structuredClone(this.sharedService.company);
      this.initForms();
    }
  }

  initForms(){
    this.formGroup = this.formBuilder.group({
      name: [this.company.name, Validators.required],
      email: [this.company.email, [Validators.required, Validators.email]],
      phone: [this.company.phone],
      website: [this.company.website],
      address: [this.company.address, Validators.required],
      description: [this.company.description, Validators.required]
    })
  }

  setUserDetails(){
    this.company.name = this.formGroup.controls['name'].value == '' ? null : this.formGroup.controls['name'].value;
    this.company.description = this.formGroup.controls['description'].value == '' ? null : this.formGroup.controls['description'].value;
    this.company.address = this.formGroup.controls['address'].value == '' ? null : this.formGroup.controls['address'].value;
    this.company.email = this.formGroup.controls['email'].value == '' ? null : this.formGroup.controls['email'].value;
    this.company.phone = this.formGroup.controls['phone'].value == '' ? null : this.formGroup.controls['phone'].value;
    this.company.website = this.formGroup.controls['website'].value == '' ? null : this.formGroup.controls['website'].value;
    this.disableSaveButton = this.isDeeplyEquals();
  }

  isDeeplyEquals(): boolean{
    return JSON.stringify(this.company) === JSON.stringify(this.sharedService.company);
  }

  saveChanges(){
    this.isSaveButtonClicked = true;

    if(this.formGroup.invalid) return;

    this.companyService.changeCompanyDetails(this.company).subscribe({
      next: (apiResponse: ApiResponse) => {
        if(apiResponse.success)
          if(this.sharedService.principal) {
            if(this.sharedService.principal.team)
              this.sharedService.principal.team.company = apiResponse.data;
            this.sharedService.company = apiResponse.data;
            this.disableSaveButton = true;
          }
      },
      error: (error: Error) => {console.error(error);}
    })
  }
}
