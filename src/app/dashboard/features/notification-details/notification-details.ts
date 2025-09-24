import {Component, Input, OnInit} from '@angular/core';
import {Profile} from '../profile/profile';
import {TranslatePipe} from '@ngx-translate/core';
import {PublicService} from '../../../services/public-service';
import {ApiResponse, CustomNotification} from '../../../services/models';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-notification-details',
  imports: [
    Profile,
    TranslatePipe,
    CommonModule
  ],
  templateUrl: './notification-details.html',
  styleUrl: './notification-details.scss'
})
export class NotificationDetails implements OnInit {
  @Input() notificationId?: number;
  notification?: CustomNotification;
  constructor(private publicService: PublicService) {
  }

  ngOnInit(): void {
    this.getNotificationDetails();
    }

  getNotificationDetails(){
    this.publicService.getNotificationDetails(this.notificationId || 0).subscribe({
      next: (apiResponse: ApiResponse) => {
        if (apiResponse.success){
          this.notification = apiResponse.data;
        }
      }
    })
  }
}
