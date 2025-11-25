import {Component, HostListener, NgZone} from '@angular/core';
import {Router} from '@angular/router';
import {Shared} from '../../services/shared';
import {AsyncPipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {Select} from 'primeng/select';
import {FormsModule} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';
import {TimeAgoPipe} from '../../pipes/time-ago-pipe';
import {Client, Message} from '@stomp/stompjs';
import {BehaviorSubject, map} from 'rxjs';
import {ApiResponse, NotificationDTO, Role} from '../../services/models';
import {PublicService} from '../../services/public-service';
import SockJS from 'sockjs-client';
import {environment} from '../../config/environment';
import {Dialog} from 'primeng/dialog';
import {NotificationDetails} from '../../dashboard/features/notification-details/notification-details';

@Component({
  selector: 'app-navbar',
  imports: [
    NgIf,
    Select,
    FormsModule,
    TranslatePipe,
    AsyncPipe,
    NgForOf,
    TimeAgoPipe,
    NgClass,
    Dialog,
    NotificationDetails
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
  showDetails: boolean = false ;
  unreadCount$ = this.notifications$.pipe(
    map(list => (list ?? []).filter(n => !n.read).length)
  );
  notificationDto?: NotificationDTO
  constructor(public sharedService: Shared,private ngZone: NgZone,private publicService: PublicService,private router: Router) {
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
    this.publicService.getNotifications(this.sharedService.principal?.email,false).subscribe({
      next: (apiResponse: ApiResponse)  => {
        if(apiResponse.success){
          apiResponse.data.forEach((notification: NotificationDTO) => {
            let current = this.notificationsSubject.value;
            this.notificationsSubject.next([...current, notification]);
          })
        }
      },
      error: (e: any) => console.error(e)
    })
  }

  private addNotification(notification: any) {
    if(notification.toEmail == this.sharedService.principal?.email) {
      const current = this.notificationsSubject.value;
      this.notificationsSubject.next([notification, ...current]);
    }
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
    if(!this.notificationShown) this.setNotifications();
  }

  private setNotificationsReadStatus() {
    this.unreadCount$ = this.notifications$.pipe(
      map(list => (list ?? []).filter(n => !n.read).length)
    );
  }
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (this.notificationShown) {
      const target = event.target as HTMLElement;
      if (!this.dropdownMenu.contains(target) &&
        !target.closest('[dropdown-trigger]')) {
        this.dropdownMenu.classList.remove('show');
        this.notificationShown = false;
        this.setNotifications();
      }
    }
    if (this.sharedService.isMenuShown) {
      const target = event.target as HTMLElement;
      const link = document.getElementById('menu-toggle')
      if ((!this.sharedService.menu.contains(target) && !link?.contains(target)) &&
        !target.closest('[dropdown-trigger]')) {
        this.sharedService.toggleMenu();
      }
    }
  }
  setNotifications() {
    let current = this.notificationsSubject.value;
    let unreadCount = 0
    this.unreadCount$.subscribe( number => unreadCount = number)
    if(current?.length > 0 && unreadCount > 0) {
      this.publicService.setNotificationsReadStatus(this.notificationsSubject.value).subscribe({
        next: (apiResponse: ApiResponse) => {
          if(apiResponse.success){

            this.notificationsSubject = new BehaviorSubject<any[]>([]);
            current.forEach((notification: NotificationDTO) => {
              notification.read = true
            })
            this.notificationsSubject.next([...current]);
            this.notifications$ = this.notificationsSubject.asObservable();
            this.setNotificationsReadStatus();
          }
        },
        error: (e: any) => console.error(e)
      })
    }
  }
  showAllNotifications(event: Event){
    let basePath = 'dashboard'
    if(this.sharedService.principal?.role == Role.EMPLOYEE){
      basePath = 'home'
    }
    this.toggleDropdown(event);
    this.sharedService.customNavigation(basePath + '/notifications','notifications_history_title');
  }

  showDetailsDialog(event: any, data: any){
    let basePath = 'dashboard'
    if(this.sharedService.principal?.role == Role.EMPLOYEE){
      basePath = 'home'
    }
    this.toggleDropdown(event)
    if(data.titleLabel == "book_holiday_approved_notification_title" || data.titleLabel == "book_holiday_rejected_notification_title") {
      this.clearHighlight();
      this.sharedService.customNavigation(basePath + '/holidays','navbar_screen_title_manage_holidays')
      this.doHighlight("holidays-link");
      this.sharedService.activeHolidayAccordingPanel = '1';
    }else if(data.titleLabel == "book_holiday_canceled_notification_title" || data.titleLabel == "book_holiday_notification_title") {
      this.clearHighlight();
      this.sharedService.customNavigation(basePath + '/holidays','navbar_screen_title_manage_holidays')
      this.doHighlight("holidays-link");
      this.sharedService.activeHolidayAccordingPanel = '2';
    }else if(data.titleLabel == "notification_edit_user_title") {
      this.clearHighlight();
      this.sharedService.customNavigation(basePath + '/profile','navbar_screen_title_manage_profile')
      this.doHighlight("profile-link");
    } else if(data.titleLabel == "manage_document_add_document_notification_title") {
      this.clearHighlight();
      this.sharedService.customNavigation(basePath + '/documents','navbar_screen_title_manage_documents')
      this.doHighlight("document-link");
    } else if(data.titleLabel == "manage_event_add_event_notification_title") {
      this.clearHighlight();
      this.sharedService.customNavigation(basePath + '/events','navbar_screen_title_events')
      this.doHighlight("event-link");
    }
    this.notificationDto = data;
    this.showDetails = true;
  }
  selectedMenuLinkClasses: string[] = ['bg-blue-500/13', 'font-semibold', 'text-slate-700']
  doHighlight(elementId: string){
    document.getElementById(elementId)?.classList.add(this.selectedMenuLinkClasses[0],this.selectedMenuLinkClasses[1],this.selectedMenuLinkClasses[2]);
  }
  clearHighlight(){
    let links = document.getElementsByClassName("bg-blue-500/13")
    for(let link of links){
      link.classList.remove(this.selectedMenuLinkClasses[0],this.selectedMenuLinkClasses[1],this.selectedMenuLinkClasses[2]);
    }
  }

  navigate(url: string) {
    this.router.navigate([url]);
  }

}
