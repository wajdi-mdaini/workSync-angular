import { Component } from '@angular/core';
import {PublicService} from '../../../services/public-service';
import {Shared} from '../../../services/shared';
import {ApiResponse, NotificationDTO} from '../../../services/models';
import {TableModule} from 'primeng/table';
import {TranslatePipe} from '@ngx-translate/core';
import {CommonModule, DatePipe} from '@angular/common';
import {DialogModule} from 'primeng/dialog';
import {NotificationDetails} from '../notification-details/notification-details';
@Component({
  selector: 'app-notifications-list',
  imports: [TableModule, TranslatePipe, DatePipe, DialogModule, NotificationDetails, CommonModule],
  standalone: true,
  templateUrl: './notifications-list.html',
  styleUrl: './notifications-list.scss'
})
export class NotificationsList {
  notifications!: Notification[];
  showDetails: boolean = false;
  notificationDto?: NotificationDTO
  constructor(private publicService: PublicService,private sharedService: Shared) {
    this.publicService.getNotifications(this.sharedService.principal?.email,true).subscribe( {
      next: (apiResponse:ApiResponse) => {
        if(apiResponse.success) this.notifications = apiResponse.data;
      },
      error: (error) => { console.log(error); },
    })
  }

  showDetailsDialog(data: any){
    this.notificationDto = data;
    this.showDetails = true;
  }
}
