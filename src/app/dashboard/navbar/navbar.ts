import {Component, HostListener , NgZone} from '@angular/core';
import {Shared} from '../../services/shared';
import {TranslatePipe} from '@ngx-translate/core';
import {ApiResponse, NotificationDTO, Role} from '../../services/models';
import SockJS from 'sockjs-client';
import {Client, Message} from '@stomp/stompjs';

import {BehaviorSubject, map} from 'rxjs';
import {environment} from '../../config/environment';
import {AsyncPipe, NgFor, NgIf} from '@angular/common';
import {EmployeeService} from '../../services/employee-service';
import {TimeAgoPipe} from '../../pipes/time-ago-pipe';
@Component({
  selector: 'app-navbar',
  imports: [
    TranslatePipe,
    AsyncPipe,
    NgFor,
    TimeAgoPipe,
    NgIf
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {
  private stompClient: Client;
  private notificationsSubject = new BehaviorSubject<any[]>([]);
  notifications$ = this.notificationsSubject.asObservable();
  dropdownMenu?: any ;
  notificationShown: boolean = false ;
  unreadCount$ = this.notifications$.pipe(
    map(list => (list ?? []).filter(n => !n.read).length)
  );
  constructor(public sharedService: Shared,private ngZone: NgZone,private employeeService: EmployeeService) {
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(environment.apiBaseUrl + '/ws'),
      reconnectDelay: 5000
    });

    this.stompClient.onConnect = () => {
      this.stompClient.subscribe('/topic/notifications', (message: Message) => {
        const notification = JSON.parse(message.body);
          this.addNotification(notification);
      });
    };


      this.stompClient.activate();
      this.getAllNotifications();
  }

  getAllNotifications(){
    this.employeeService.getNotifications(this.sharedService.principal?.email).subscribe({
      next: (apiResponse: ApiResponse)  => {
        if(apiResponse.success){
          apiResponse.data.forEach((notification: NotificationDTO) => {
            this.addNotification(notification);
          })
        }
      },
      error: (e: any) => console.error(e)
    })
  }

  getSortedNotifications(notifications: any[]) {
    return [...notifications].sort(
      (a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()
    );
  }

  private addNotification(notification: any) {
    const current = this.notificationsSubject.value;
    this.notificationsSubject.next([notification, ...current]);
  }

  get getRole(): string {
    if (this.sharedService.principal?.role == Role.MANAGER) return 'navbar_role_manager_title';
    else if (this.sharedService.principal?.role == Role.ADMIN) return 'navbar_role_admin_title';
    return '';
  }

  toggleDropdown(event: Event) {
    this.dropdownMenu = document.getElementById('dropdownMenu')
    event.preventDefault();
    this.dropdownMenu.classList.toggle('show');
    this.notificationShown = !this.notificationShown;
  }
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (this.notificationShown) {
      const target = event.target as HTMLElement;
      if (!this.dropdownMenu.contains(target) &&
        !target.closest('[dropdown-trigger]')) {
        this.dropdownMenu.classList.remove('show');
        this.notificationShown = false;
      }
    }
  }

}
