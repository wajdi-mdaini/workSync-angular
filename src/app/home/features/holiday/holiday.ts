import {Component, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {Shared} from '../../../services/shared';
import {DatePicker} from 'primeng/datepicker';
import {HolidayList} from '../holiday-list/holiday-list';
import {NgClass, NgIf} from '@angular/common';
import {Select} from 'primeng/select';
import {ApiResponse, Holiday as HolidayModel, HolidayStatus, HolidayType, Role} from '../../../services/models';
import {ButtonModule} from 'primeng/button';
import {AccordionModule} from 'primeng/accordion';
import {PublicService} from '../../../services/public-service';

@Component({
  selector: 'app-holiday',
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    DatePicker,
    FormsModule,
    HolidayList,
    NgIf,
    Select,
    ButtonModule,
    AccordionModule,
    NgClass
  ],
  templateUrl: './holiday.html',
  styleUrl: './holiday.scss'
})
export class Holiday implements OnInit {
  selectedRange: Date[] | undefined;
  newHolidaysRanges: any[] = [];
  currentUserHolidays: any[] = [];
  holidayRequests: any[] = [];
  rawHolidayTypes = Object.values(HolidayType);
  holidayTypes: any[] = [];
  selectedType?: any;
  authUserSicknessLeaverSold: number = 0;
  authUserAnnualLeaverSold: number = 0;
  calendarReadyToDisplay: boolean = false;
  constructor(public sharedStore: Shared,
              private translate: TranslateService,
              private publicService: PublicService) {
  }

  ngOnInit() {
    this.authUserSicknessLeaverSold = this.sharedStore.principal.sicknessLeaverSold
    this.authUserAnnualLeaverSold = this.sharedStore.principal.holidaySold
    this.initHolidaysTypeList();
    this.getHolidaysList();
    if(this.sharedStore.principal.role != Role.EMPLOYEE)
      this.getHolidayRequests();

    setTimeout(() => {
      this.calendarReadyToDisplay = true;
      }, 1000);

  }

  getHolidaysList() {
        this.publicService.getHolidayList(this.sharedStore.principal.email).subscribe({
          next: (apiResponse: ApiResponse) => {
            if(apiResponse.success){
              apiResponse.data.forEach( (holiday: HolidayModel) =>{
                let holidayType: string = this.getHolidayType(holiday.type)
                this.currentUserHolidays?.push({
                  from: holiday.from,
                  to: holiday.to,
                  type: {label: holidayType, value: holiday.type},
                  status: holiday.status,
                  at: holiday.at,
                  id: holiday.id
                });
                if(holiday.status != HolidayStatus.REJECTED)
                  this.setDisabledDates(holiday.from,holiday.to)
              })
            }
          },
          error: err => {console.log(err)},
        })
    }

    getHolidayType(selectedType: any){
      switch (selectedType) {
        case 'SICKNESS_LEAVER': {
          return  this.translate.instant('holiday_type_sickness_leaver');
        }
        case 'ANNUAL_LEAVER': {
          return this.translate.instant('holiday_type_annual_leaver');
        }
        case 'PERMISSION': {
          return  this.translate.instant('holiday_type_permission');
        }
      }
    }
  selectTypeError: boolean = false;
  wrongDateSelectedError: boolean = false;
  wrongDaysNumberError: boolean = false;
  addRangeToList(){
    if(this.selectedRange && this.selectedRange[0] && this.selectedRange[1]) {
      if(this.checkUsedDate(this.selectedRange[0], this.selectedRange[1])){
        this.selectTypeError = false;
        this.wrongDaysNumberError = false;
        this.wrongDateSelectedError = true;
      }else{
        if(this.selectedType){
          let daysNumber = this.coundDays(this.selectedRange[0], this.selectedRange[1])
          if(
            ((daysNumber > this.authUserAnnualLeaverSold) && this.selectedType == HolidayType.ANNUAL_LEAVER) ||
            ((daysNumber> this.authUserSicknessLeaverSold) && this.selectedType == HolidayType.SICKNESS_LEAVER)
          ){
            this.selectTypeError = false;
            this.wrongDateSelectedError = false;
            this.wrongDaysNumberError = true;
          }else{
            let holidayType: string = this.getHolidayType(this.selectedType)
            this.newHolidaysRanges?.push({
              from: this.selectedRange[0],
              to: this.selectedRange[1],
              type: {label: holidayType, value: this.selectedType},
              status: ''
            });
            if(this.selectedType == HolidayType.ANNUAL_LEAVER) this.authUserAnnualLeaverSold -= daysNumber;
            else if(this.selectedType == HolidayType.SICKNESS_LEAVER) this.authUserSicknessLeaverSold -= daysNumber;
            this.setDisabledDates(this.selectedRange[0], this.selectedRange[1]);
            this.wrongDateSelectedError = false;
            this.selectTypeError = false;
            this.wrongDaysNumberError = false;
            this.selectedType = '';
            this.selectedRange = undefined;
          }
        }else {
          this.selectTypeError = true;
          this.wrongDateSelectedError = false;
          this.wrongDaysNumberError = false;
        }
      }
    }
  }
  disabledDates: Date[] = [];
  setDisabledDates(start: any | undefined, end: any | undefined){
    let current = new Date(start);
    while (current <= end) {
      if (!this.disabledDates.some(d => d.getTime() === current.getTime()))
        this.disabledDates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
  }
  coundDays(start: any | undefined, end: any | undefined): number{
    let current = new Date(start);
    let countSelectedDays: number = 0
    while (current <= end) {
      countSelectedDays ++;
      current.setDate(current.getDate() + 1);
    }
    return countSelectedDays;
  }
  checkUsedDate(start: any | undefined, end: any | undefined): boolean{
    let current = new Date(start);
    let result: boolean = false
    while (current <= end) {
      if (this.disabledDates.some(d => d.getTime() === current.getTime())) {
        result = true;
        break;
      }
      current.setDate(current.getDate() + 1);
    }
    return result;
  }

  private getHolidayRequests() {
    this.publicService.getHolidayRequestsList(this.sharedStore.principal.email).subscribe({
      next: (apiResponse: ApiResponse) => {
        if(apiResponse.success){
          apiResponse.data.forEach( (holiday: HolidayModel) =>{
            let holidayType: string = this.getHolidayType(holiday.type)
            this.holidayRequests?.push({
              from: holiday.from,
              to: holiday.to,
              type: {label: holidayType, value: holiday.type},
              id: holiday.id,
              profilePictureUrl: holiday.user.profilePictureUrl,
              fullName: holiday.user.firstname + ' ' + holiday.user.lastname,
              email: holiday.user.email,
              at: holiday.at,
            });
          })
        }
      },
      error: err => { console.log(err); }
    })

  }

  protected readonly Role = Role;

  initHolidaysTypeList() {
    this.holidayTypes = [];
    this.rawHolidayTypes?.forEach(type =>{
      let result = {}
      switch (type) {
        case 'SICKNESS_LEAVER': {
          result = { label: this.translate.instant('holiday_type_sickness_leaver') + ' ( '+ this.sharedStore.principal.sicknessLeaverSold +' days left )', value: 'SICKNESS_LEAVER'};
          break;

        }case 'ANNUAL_LEAVER':{
          result = { label: this.translate.instant('holiday_type_annual_leaver') + ' ( '+ this.sharedStore.principal.holidaySold +' days left )', value: 'ANNUAL_LEAVER'};
          break;
        }
        case 'PERMISSION':{
          result = { label: this.translate.instant('holiday_type_permission'), value: 'PERMISSION'};
          break;
        }
      }
      this.holidayTypes.push(result)
    })
  }

  refreshCurrentUserHolidaysList(event: any){
    this.disabledDates = [];
    this.currentUserHolidays = [];
    this.getHolidaysList();
  }

  refreshHolidayRequests(){
    this.holidayRequests = [];
    this.getHolidayRequests();
  }

  deleteNewHolidayFromList(event: any){
    if(event?.ranges) this.newHolidaysRanges = event.ranges;

    let current = new Date(event.deletedRange.from);
    while (current <= new Date(event.deletedRange.to) ) {
      if (this.disabledDates.some(d => d.getTime() === current.getTime()))
        this.disabledDates= this.disabledDates.filter(d => d.getTime() !== current.getTime());
      current.setDate(current.getDate() + 1);
    }
  }

  doSaveNewHoliday(){
    this.newHolidaysRanges = [];
    this.disabledDates = [];
    this.currentUserHolidays = [];
    this.getHolidaysList();
    this.initHolidaysTypeList();
    if(this.sharedStore.principal.role != Role.EMPLOYEE)
      this.refreshHolidayRequests();
    this.sharedStore.activeHolidayAccordingPanel = '1';
  }
}
