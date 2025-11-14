import {Component, Input, OnInit} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Shared} from '../../../services/shared';
import {CompanyService} from '../../../services/company-service';
import {ApiResponse} from '../../../services/models';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-settings-form',
  imports: [
    TranslatePipe,
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './settings-form.html',
  styleUrl: './settings-form.scss'
})
export class SettingsForm implements OnInit {

  @Input() isFirstLogin: boolean = false;

  formGroup: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder,
              private sharedService: Shared,
              private companyService: CompanyService) {
  }

  ngOnInit() {
    this.initFormGroup()
  }

  initFormGroup() {
    let company = this.sharedService.company;
    this.formGroup = this.fb.group({
      id: [company.settings.id, Validators.required],
      verificationCodeLength: [company.settings.verificationCodeLength, [Validators.required, Validators.max(6)]],
      verificationCodeExpireIn: [company.settings.verificationCodeExpireIn, [Validators.required, Validators.max(5)]],
      jwtTokenExpireIn: [company.settings.jwtTokenExpireIn, [Validators.required, Validators.max(60)]],
      holidayDaysPerMonth: [company.settings.holidayDaysPerMonth, [Validators.required, Validators.max(20)]],
      sicknessLeaverDaysPerYear: [company.settings.sicknessLeaverDaysPerYear, [Validators.required, Validators.max(20)]],
      passwordMinLength: [company.settings.passwordMinLength, [Validators.required, Validators.max(20), Validators.min(8)]],
    })
  }

  onMaxLimitVerificationCodeLength(event: any) {
    const input = event.target;
    if (input?.value > 6) input.value = 6;
  }

  onMaxLimitVerificationCodeExpireIn(event: any) {
    const input = event.target;
    if (input?.value > 5) input.value = 5;
  }

  onMaxLimitJwtTokenExpireIn(event: any) {
    const input = event.target;
    if (input?.value > 60) input.value = 60;
  }

  onMaxLimitHolidayDaysPerMonth(event: any) {
    const input = event.target;
    if (input?.value > 20) input.value = 20;
  }

  onMaxLimitSicknessLeaverDaysPerYear(event: any) {
    const input = event.target;
    if (input?.value > 20) input.value = 20;
  }

  onMaxAndMinLimitPasswordLength(event: any) {
    const input = event.target;
    if (input?.value > 20) input.value = 20;
    else if(input?.value < 8) input.value = 8;
  }

  get isTouched(): boolean {
    let company = this.sharedService.company;
    return (this.formGroup.get('verificationCodeLength')?.value != company.settings.verificationCodeLength ||
            this.formGroup.get('verificationCodeExpireIn')?.value != company.settings.verificationCodeExpireIn ||
            this.formGroup.get('jwtTokenExpireIn')?.value != company.settings.jwtTokenExpireIn ||
            this.formGroup.get('holidayDaysPerMonth')?.value != company.settings.holidayDaysPerMonth ||
            this.formGroup.get('sicknessLeaverDaysPerYear')?.value != company.settings.sicknessLeaverDaysPerYear ||
            this.formGroup.get('passwordMinLength')?.value != company.settings.passwordMinLength)

  }

  saveChanges() {
    if(this.isTouched && this.formGroup.valid)
      this.companyService.setCompanySettings(this.formGroup.value).subscribe({
        next: (apiResponse: ApiResponse) => {
          if (apiResponse.success)
            this.sharedService.company = apiResponse.data;
        }, error: err => {
          console.log(err)
        }
      });
  }

}
