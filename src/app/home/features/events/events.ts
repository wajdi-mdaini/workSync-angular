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
import {
  ApiResponse,
  EditEventDTO,
  Event as EventModel,
  EventDTO,
  EventType,
  Role,
  User
} from '../../../services/models';
import {Dialog} from 'primeng/dialog';
import {ConfirmationService, PrimeTemplate, SelectItemGroup} from 'primeng/api';
import {MultiSelect} from 'primeng/multiselect';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Select} from 'primeng/select';
import {IftaLabel} from 'primeng/iftalabel';
import {Textarea} from 'primeng/textarea';
import {DatePicker} from 'primeng/datepicker';
import {ConfirmDialog} from 'primeng/confirmdialog';

@Component({
  selector: 'app-events',
  imports: [
    FullCalendarModule,
    TranslatePipe,
    Dialog,
    NgIf,
    MultiSelect,
    FormsModule,
    PrimeTemplate,
    Select,
    NgClass,
    IftaLabel,
    ReactiveFormsModule,
    Textarea,
    DatePicker,
    ConfirmDialog,
    NgFor
  ],
  templateUrl: './events.html',
  styleUrl: './events.scss',
  providers: [ConfirmationService]
})
export class Events implements OnInit {
  authUser!: User;
  groupedUsers: SelectItemGroup[] = [];
  rawEventTypes = Object.values(EventType);
  formGroupEdit: FormGroup = new FormGroup({});
  selectedEventToEdit!: EditEventDTO;
  showAddDialog: boolean = false
  showEditDialog: boolean = false
  showEventDetailsDialog: boolean = false
  eventDetailsToView: any;
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

    eventClick: (info) => {
      const organizer = info.event.extendedProps['organizerEmail'];
      const currentUser = this.sharedService.principal.email;
      if (organizer !== currentUser) {
        this.eventDetailsToView = info.event.extendedProps;
        this.showEventDetailsDialog = true;
        return;
      }
      console.log('Clicked', info.event.title);
      this.selectedEventToEdit = {
        from: info.event.extendedProps['from'],
        to: info.event.extendedProps['to'],
        at: info.event.extendedProps['at'],
        organizerEmail: info.event.extendedProps['organizerEmail'],
        description: info.event.extendedProps['description'],
        type: info.event.extendedProps['eventType'],
        participantEmails: info.event.extendedProps['participantEmails'],
        title: info.event.extendedProps['title'],
        id: info.event.extendedProps['id'],
        fullcalendarEvent: false
      }
      this.initEditFormGroup();
      this.showEditDialog = true;
    }
  };

  constructor(private eventService: EventService,
              private sharedService: Shared,
              private translate: TranslateService,
              private formBuilder: FormBuilder,
              private confirmationService: ConfirmationService) {
  }

  ngOnInit() {
    this.authUser = this.sharedService.principal;
    this.getAllEvents();
    this.initHolidaysTypeList();
  }

  initEditFormGroup() {
    if(this.selectedEventToEdit.from && this.selectedEventToEdit.to)
    this.formGroupEdit = this.formBuilder.group({
      id: new FormControl(this.selectedEventToEdit.id, Validators.required),
      title: new FormControl(this.selectedEventToEdit.title, Validators.required),
      description: new FormControl(this.selectedEventToEdit.description),
      at: new FormControl(new Date().getTime(), Validators.required),
      from: new FormControl(new Date(new Date(this.selectedEventToEdit.from).setHours(0, 0, 0, 0)), Validators.required),
      to: new FormControl(new Date(new Date(this.selectedEventToEdit.to).setHours(0, 0, 0, 0)), Validators.required),
      participantEmails: new FormControl(this.selectedEventToEdit.participantEmails, Validators.required),
      organizerEmail: new FormControl(this.selectedEventToEdit.organizerEmail, Validators.required),
      type: new FormControl(this.selectedEventToEdit.type, Validators.required),
    })
  }

  updateEventInBackend(event: EventApi) {
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
      organizerEmail: ''
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
    this.eventService.getAllEvents(this.authUser.email).subscribe({
      next: (apiResponse: ApiResponse) => {
        if(apiResponse.success){
          let eventList: any[] = [];
          let events: any[] = apiResponse.data;
          events?.forEach((event: EventModel) => {
            let participants: User[] = []
            event.participants.forEach((participant: User) => {
              if(this.authUser.email != participant.email) participants.push(participant);
            })
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
                id: event.id,
                organizerEmail: event.organizer?.email,
                title: event.title,
                description: event.description,
                at: event.at,
                from: event.from,
                to: event.to,
                eventType: event.eventType,
                participantEmails: participants,
                organizer: event.organizer
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
  newEventDateFrom: Date = new Date(new Date().setHours(0, 0, 0, 0));
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
  getAllCompanyUsers(importAll: boolean){
    this.eventService.getCompanyUsers(this.authUser.email).subscribe({
      next: (apiResponse: ApiResponse) => {
        if(apiResponse.success){
          let allUsers: User[] = apiResponse.data;
          if(importAll)
            this.setupUserList(allUsers);
          else{
            if(this.showEditDialog){
              if( this.formGroupEdit.get('type')?.value == EventType.TASK && this.authUser.role == Role.MANAGER){
                this.formGroupEdit.get('participantEmails')?.setValue([]);
                let employees: User[] = [];
                allUsers.forEach(user => {
                  this.authUser.teams?.forEach((team: any) => {
                    if(team.id == user.team?.id) employees.push(user);
                  });
                });
                this.setupUserList(employees);
              }else this.setupUserList(allUsers);
            }else if(this.showAddDialog){
              if( this.selectedEventType == EventType.TASK && this.authUser.role == Role.MANAGER){
                this.selectedUsers = []
                let employees: User[] = [];
                allUsers.forEach(user => {
                  this.authUser.teams?.forEach((team: any) => {
                    if(team.id == user.team?.id) employees.push(user);
                  });
                });
                this.setupUserList(employees);
              }else this.setupUserList(allUsers);
            }
          }
        }
      },
      error: (err) => {console.log(err)}
    })
  }

  setupUserList(usersList: User[]){
    this.groupedUsers = []
    let teamGroupTitle = this.translate.instant('manage_event_add_event_users_list_team_group')
    let companyGroupTitle = this.translate.instant('manage_event_add_event_users_list_company_group')
    let users: User[] = usersList;
    if(this.authUser.team){
      let teamGroup: SelectItemGroup = {
        label: teamGroupTitle,
        items: []
      }
      let companyGroup: SelectItemGroup = {
        label: companyGroupTitle,
        items: []
      }
      users?.forEach(user => {
        if(user.email != this.authUser.email){
          let item: any = {
            label: user.firstname + ' ' + user.lastname + '(' + user.email + ')',
            value: user
          }
          if (user.team?.id == this.authUser.team?.id)
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
      if((type != EventType.TASK) || this.authUser.role != Role.EMPLOYEE )
        this.eventTypes.push(result)
    })
  }
  doEditClicked: boolean = false
  editEvent(){
    this.selectEventDateToError = false;
    this.selectEventDateFromError = false;
    this.doEditClicked = true;
    if(this.formGroupEdit.invalid) return;
    if (this.formGroupEdit.valid) {
      if (new Date(this.formGroupEdit.get('from')?.value).getTime() > new Date(this.formGroupEdit.get('to')?.value).getTime()) {
        this.selectEventDateToError = true;
        this.selectEventDateFromError = true;
      }else{
        let participantEmails: string[] = [];
        participantEmails.push( this.sharedService.principal.email);
        this.formGroupEdit.get('participantEmails')?.value?.forEach((user: any) => {
          participantEmails.push(user.email);
        })
        let payloadEdit: EditEventDTO = {
          id: this.formGroupEdit.get('id')?.value,
          title: this.formGroupEdit.get('title')?.value,
          description: this.formGroupEdit.get('description')?.value,
          at: this.formGroupEdit.get('at')?.value,
          from: new Date(this.formGroupEdit.get('from')?.value).getTime(),
          to: new Date(this.formGroupEdit.get('to')?.value).getTime(),
          participantEmails: participantEmails ,
          organizerEmail: this.formGroupEdit.get('organizerEmail')?.value,
          type: this.formGroupEdit.get('type')?.value,
          fullcalendarEvent: false
        }
        payloadEdit.participantEmails
        this.eventService.editEvent(payloadEdit).subscribe({
          next: (apiResponse: ApiResponse) => {
            if(apiResponse.success){
              this.getAllEvents();
              this.selectEventDateToError = false;
              this.selectEventDateFromError = false;
              this.showEditDialog = false;
              this.selectedEventToEdit = {} as EditEventDTO;
            }
          },error: (err) => {console.log(err)}
        })
      }
    }
  }

  doConfirmDelete(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: this.translate.instant('manage_event_delete_event_dialog_message'),
      header: this.translate.instant('manage_event_delete_event_dialog_header'),
      icon: 'fa fa-info-circle',
      rejectLabel: this.translate.instant('button_cancel'),
      rejectButtonProps: {
        label: this.translate.instant('button_cancel'),
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: this.translate.instant('button_delete'),
        severity: 'danger',
      },

      accept: () => {
        this.eventService.deleteEvent(this.selectedEventToEdit.id).subscribe({
          next: (apiResponse: ApiResponse) => {
            if(apiResponse.success) {
              this.getAllEvents();
              this.selectEventDateToError = false;
              this.selectEventDateFromError = false;
              this.showEditDialog = false;
              this.selectedEventToEdit = {} as EditEventDTO;
            }
          },
          error: (err) => {console.log(err);},
        })
      }
    });
  }

  resetTime(timesTamp: number){
    return new Date(timesTamp);
  }
  getDate(timesTamp: number){
    let date = new Date(timesTamp);
    let d = date.getDate().toString().padStart(2, '0');
    let m = (date.getMonth() + 1).toString().padStart(2, '0');
    let y = date.getFullYear();
    return `${d}-${m}-${y}`;  }
}
