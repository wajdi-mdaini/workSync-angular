import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {TableModule} from 'primeng/table';
import {DatePipe, NgIf} from '@angular/common';
import {ApiResponse, BookHolidayDTO, Holiday, HolidayStatus} from '../../../services/models';
import {PublicService} from '../../../services/public-service';
import {Shared} from '../../../services/shared';

@Component({
  selector: 'app-holiday-list',
  imports: [
    TranslatePipe,
    TableModule,
    DatePipe,
    NgIf
  ],
  templateUrl: './holiday-list.html',
  styleUrl: './holiday-list.scss'
})
export class HolidayList {
  @Input() ranges: any[] = [];
  @Input() showSaveButton: boolean = false;
  @Input() isRequests: boolean = false;
  @Output() refreshCurrentHolidays = new EventEmitter<boolean>();
  @Output() refreshHolidayRequests = new EventEmitter<boolean>();
  @Output() deleteNewHolidayList = new EventEmitter();
  @Output() doSaveNewHoliday = new EventEmitter();

  constructor(private publicService: PublicService,
              private sharedService: Shared) {
  }
  deDelete(holiday: any) {
    let index: number = this.ranges.indexOf(holiday);
    this.ranges.splice(index,1)
    this.deleteNewHolidayList.emit({ ranges: this.ranges , deletedRange: holiday });
  }

  doSave(){
    let holidaysList: BookHolidayDTO[] = []
    this.ranges.forEach(range => {
      let holidayDTO: BookHolidayDTO = {
        from: new Date(range.from).getTime(),
        to: new Date(range.to).getTime(),
        type: range.type?.value,
        status: HolidayStatus.WAITING,
        countedDays: this.coundDays(range.from,range.to)
      }
      holidaysList.push(holidayDTO);

    })
    this.publicService.holidayRequest(holidaysList).subscribe({
      next: (apiResponse: ApiResponse) => {
        if(apiResponse.success){
          this.ranges = [];
          if(apiResponse.data[0]?.user)
            this.sharedService.principal = apiResponse.data[0]?.user;
          this.doSaveNewHoliday.emit();
        }
      },
      error: (error: Error) => {console.log(error);}
    })
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

  approveRequest(holidayId: number) {
    this.publicService.approveHoliday(holidayId).subscribe({
      next: (apiResponse: ApiResponse) => {
        if(apiResponse.success){
          this.refreshHolidayRequests.emit();
        }
      },
      error: (error: Error) => {console.log(error);}
    });
  }

  rejectRequest(holidayId: number) {
    this.publicService.rejectHoliday(holidayId).subscribe({
      next: (apiResponse: ApiResponse) => {
        if(apiResponse.success){
          this.refreshHolidayRequests.emit();
        }
      },
      error: (error: Error) => {console.log(error);}
    });
  }

  cancelRequest(holidayId: number) {
    this.publicService.cancelHoliday(holidayId).subscribe({
      next: (apiResponse: ApiResponse) => {
        if(apiResponse.success){
          this.refreshCurrentHolidays.emit();
        }
      },
      error: (error: Error) => {console.log(error);}
    });
  }

  protected readonly HolidayStatus = HolidayStatus;
}
