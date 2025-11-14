import { Component } from '@angular/core';
import {NotificationsList} from '../../../dashboard/features/notifications-list/notifications-list';

@Component({
  selector: 'app-notifications',
  imports: [
    NotificationsList
  ],
  templateUrl: './notifications.html',
  styleUrl: './notifications.scss'
})
export class Notifications {

}
