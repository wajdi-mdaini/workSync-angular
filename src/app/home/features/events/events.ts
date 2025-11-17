import {Component, OnInit} from '@angular/core';
import {FullCalendarModule} from '@fullcalendar/angular';
import {CalendarOptions, EventApi} from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import {NgClass, NgFor, NgIf} from '@angular/common';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {EventService} from '../../../services/event-service';
import {Shared} from '../../../services/shared';
import {ApiResponse, EditEventDTO, Event as EventModel, EventDTO, EventType, User} from '../../../services/models';
import {Dialog} from 'primeng/dialog';
import {PrimeTemplate, SelectItemGroup} from 'primeng/api';
import {MultiSelect} from 'primeng/multiselect';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Select} from 'primeng/select';
import {IftaLabel} from 'primeng/iftalabel';
import {Textarea} from 'primeng/textarea';
import {DatePicker} from 'primeng/datepicker';

@Component({
  selector: 'app-events',
  imports: [FullCalendarModule, NgFor, TranslatePipe, Dialog, NgIf, MultiSelect, FormsModule, PrimeTemplate, Select, NgClass, IftaLabel, ReactiveFormsModule, Textarea, DatePicker],
  templateUrl: './events.html',
  styleUrl: './events.scss'
})
export class Events implements OnInit {
  tasks = [
    { id: 1, title: 'Design mockup' },
    { id: 2, title: 'Fix backend bug' },
    { id: 3, title: 'Team meeting' }
  ];
  groupedUsers: SelectItemGroup[] = [];
  rawEventTypes = Object.values(EventType);

  showAddDialog: boolean = false
  eventTypes: any[] = [];
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [ interactionPlugin,dayGridPlugin,timeGridPlugin ],
    editable: true,                 // allow drag/drop/resizing of events already on calendar
    droppable: true,                // allow external elements to be dropped
    eventDurationEditable: true,    // allow resizing
    eventResizableFromStart: true,  // optional: resize from start
    selectMirror: true,
    selectable: true,
    events: [],

    // fired when an external element was dropped and converted into an event
    eventReceive: (info) => {
      // info.event is the new EventApi
      console.log('Received event', info.event.title, info.event.start, info.event.allDay);
      // OPTIONAL: remove the task from the left list
      this.removeTaskFromList(info.event.title);
      // SAVE to backend: send start/end/allDay/title
      this.saveEventToBackend(info.event);
    },

    eventResize: (info) => {
      const organizer = info.event.extendedProps['organizerEmail'];
      const currentUser = this.sharedService.principal.email;

      if (organizer !== currentUser) {
        info.revert();
        return;
      }
      this.updateEventInBackend(info.event);
    },

    eventDrop: (info) => {
      const organizer = info.event.extendedProps['organizerEmail'];
      const currentUser = this.sharedService.principal.email;

      if (organizer !== currentUser) {
        info.revert();
        return;
      }
      this.updateEventInBackend(info.event);
    },

    // optional: when user clicks an event (open PrimeNG dialog, edit details)
    eventClick: (info) => {
      console.log('Clicked', info.event.title);
      // show p-dialog here if you want to edit start/end/title etc
    }
  };

  constructor(private eventService: EventService,
              private sharedService: Shared,
              private translate: TranslateService) {
  }

  ngOnInit() {
    this.getAllCompanyUsers();
    this.getAllEvents();
    this.initHolidaysTypeList();
  }

  // helper: remove from left list after drop (optional UX)
  removeTaskFromList(title: string) {
    this.tasks = this.tasks.filter(t => t.title !== title);
  }

  // helper: example - save received event to backend
  saveEventToBackend(event: EventApi) {
    const payload = {
      title: event.title,
      start: event.start?.toISOString(),
      end: event.end?.toISOString(), // may be null for single-day allDay event
      allDay: event.allDay
    };
    // TODO: call your HTTP service here (POST) and update event.id with returned id
    console.log('SAVE', payload);
  }

  // helper: update backend when user moves/resizes event
  updateEventInBackend(event: EventApi) {
    // const payload = {
    //   id: event.id,
    //   title: event.title,
    //   start: event.start?.getTime(),
    //   end: event.end?.setDate(event.end?.getDate() - 1),
    //   allDay: event.allDay
    // };
    let payload: EditEventDTO = {
      fullcalendarEvent: true,
      id: Number(event.id),
      from: event.start?.getTime(),
      to: event.end?.setDate(event.end?.getDate() - 1),
      at: new Date().getTime(),
      title: '',
      description: '',
      participantEmails: [],
      type: EventType.EVENT,
    }
    this.eventService.editEvent(payload).subscribe({
      next: (apiResponse: ApiResponse) => {
        if( apiResponse.success ){

        }
      },
      error: (error: Error) => { console.error(error)},
    })
  }

  startOfToday(timestamp: number) {
    const d = new Date(timestamp);
    d.setHours(9,0,0,0);
    return d.toISOString().slice(0,10);
  }
  getAllEvents(){
    this.calendarOptions.events = [];
    this.eventService.getAllEvents(this.sharedService.principal.email).subscribe({
      next: (apiResponse: ApiResponse) => {
        if(apiResponse.success){
          let eventList: any[] = [];
          let events: any[] = apiResponse.data;
          events?.forEach((event: EventModel) => {
            let eventObj = {
              id: event.id,
              title: event.title,
              start: this.startOfToday(event.from),
              end: this.startOfToday(new Date(event.to).setDate(new Date(event.to).getDate() + 1)),
              color: event.eventType == EventType.ACTIVITY ? '#9C27B0' :
                event.eventType == EventType.MEETING ? '#607D8B' :
                  event.eventType == EventType.EVENT ? '#41a5a3' :
                    '',
              allDay: true,
              extendedProps: {
                organizerEmail: event.organizer?.email
              }
            }
            eventList.push(eventObj);
          })
          this.calendarOptions.events = eventList;
        }
      },
      error: (err) => {console.log(err)}
    })
  }
  selectedUsers!: User[];
  selectUsersError: boolean = false;
  selectedEventType: any = '';
  selectEventTypeError: boolean = false;
  newEventDescription: string = '';
  newEventTitle: string = '';
  selectEventTitleError: boolean = false;
  addEventButtonClicked: boolean = false;
  newEventDateFrom: Date = new Date();
  selectEventDateFromError: boolean = false;
  newEventDateTo!: Date;
  selectEventDateToError: boolean = false;
  addEvent() {
    this.selectUsersError = false;
    this.selectEventTypeError = false;
    this.selectEventTitleError = false;
    this.selectEventDateFromError = false
    this.selectEventDateToError = false
    if (this.selectedUsers == null || this.selectedUsers.length == 0) this.selectUsersError = true;
    if (this.selectedEventType == null || this.selectedEventType == '') this.selectEventTypeError = true;
    if (this.newEventTitle == null || this.newEventTitle == '') this.selectEventTitleError = true;
    if (!this.newEventDateFrom) this.selectEventDateFromError = true;
    if (!this.newEventDateTo) this.selectEventDateToError = true

    if (!this.selectUsersError && !this.selectEventTypeError && !this.selectEventTitleError && !this.selectEventDateFromError && !this.selectEventDateToError) {
      if(this.newEventDateFrom.getTime() > this.newEventDateTo.getTime()){
        this.selectEventDateFromError = true;
        this.selectEventDateToError = true
        return;
      }
      this.addEventButtonClicked = true;
      let userEmails: string[] = [];
      this.selectedUsers?.forEach((user: any) => {
        userEmails.push(user.email);
      })
      userEmails.push(this.sharedService.principal.email)
      let newEvent: EventDTO = {
        type: this.selectedEventType,
        organizerEmail: this.sharedService.principal.email,
        participantEmails: userEmails,
        title: this.newEventTitle,
        description: this.newEventDescription,
        at: new Date().getTime(),
        from: this.newEventDateFrom.getTime(),
        to: this.newEventDateTo.getTime(),
      };
      this.eventService.addEvent(newEvent).subscribe({
        next: (apiResponse: ApiResponse) => {
          if(apiResponse.success){
            this.selectedEventType = '';
            this.selectedUsers = [];
            this.newEventTitle = '';
            this.newEventDescription = '';
            this.newEventDateFrom = new Date();
            this.newEventDateTo = null as any;

            this.showAddDialog = false;
            this.getAllEvents();
          }
        },
        error: (err) => {console.log(err)}
      })
  }
  }
  getAllCompanyUsers(){
    let authUser = this.sharedService.principal;
    this.eventService.getCompanyUsers(authUser.email).subscribe({
      next: (apiResponse: ApiResponse) => {
        if(apiResponse.success){
          let teamGroupTitle = this.translate.instant('manage_event_add_event_users_list_team_group')
          let companyGroupTitle = this.translate.instant('manage_event_add_event_users_list_company_group')
          let users: User[] = apiResponse.data;
          if(authUser.team){
            let teamGroup: SelectItemGroup = {
              label: teamGroupTitle,
              items: []
            }
            let companyGroup: SelectItemGroup = {
              label: companyGroupTitle,
              items: []
            }
            users?.forEach(user => {
              if(user.email != authUser.email){
                let item: any = {
                label: user.firstname + ' ' + user.lastname + '(' + user.email + ')',
                value: user
              }
              if (user.team?.id == authUser.team?.id)
                  teamGroup.items.push(item)
                else
                  companyGroup.items.push(item)
              }
            });
            if(teamGroup.items.length > 0)
              this.groupedUsers.push(teamGroup);
            if(companyGroup.items.length > 0)
              this.groupedUsers.push(companyGroup);
          }else{
            let companyGroup: SelectItemGroup = {
              label: companyGroupTitle,
              items: []
            }
            users?.forEach(user => {
              let item: any = {
                label: user.firstname + ' ' + user.lastname + '(' + user.email + ')',
                value: user
              }
              companyGroup.items.push(item)
            });
            this.groupedUsers.push(companyGroup);
          }
        }
      },
      error: (err) => {console.log(err)}
    })
  }

  initHolidaysTypeList() {
    this.eventTypes = [];
    this.rawEventTypes?.forEach(type =>{
      let result = {}
      switch (type) {
        case 'ACTIVITY': {
          result = { label: this.translate.instant('manage_event_event_type_list_activity_label'), value: 'ACTIVITY'};
          break;

        }case 'MEETING':{
          result = { label: this.translate.instant('manage_event_event_type_list_meeting_label'), value: 'MEETING'};
          break;
        }
        case 'TASK':{
          result = { label: this.translate.instant('manage_event_event_type_list_task_label'), value: 'TASK'};
          break;
        }
        case 'EVENT':{
          result = { label: this.translate.instant('manage_event_event_type_list_event_label'), value: 'EVENT'};
          break;
        }
      }
      this.eventTypes.push(result)
    })
  }
}
