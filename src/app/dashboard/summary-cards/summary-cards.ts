import {Component, OnInit} from '@angular/core';
import {ApiResponse, CompanySummary, Document, Event, EventType} from '../../services/models';
import {PublicService} from '../../services/public-service';
import {DatePipe, NgFor, NgIf} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';
import {Shared} from '../../services/shared';
import {SharedHelper} from '../../services/shared-helper';
import {Dialog} from 'primeng/dialog';

@Component({
  selector: 'app-summary-cards',
  imports: [
    TranslatePipe,
    DatePipe,
    NgIf,
    NgFor,
    Dialog
  ],
  templateUrl: './summary-cards.html',
  styleUrl: './summary-cards.scss'
})
export class SummaryCards implements OnInit {
  companySummary?: CompanySummary
  showEventDetailsDialog: boolean = false;
  constructor(private publicService: PublicService,
              public sharedService: Shared,
              private sharedHelper: SharedHelper) {
  }

  ngOnInit() {
    this.initData();
  }

  initData(){
    this.publicService.getCompanySummary().subscribe({
      next: (apiResponse: ApiResponse) => {
        if(apiResponse.success){
          this.companySummary = apiResponse.data;
          console.log(this.companySummary);
        }
      },
      error: err => {console.log(err)}
    })
  }
  eventsToViewList: Event[] = []
  getEventsDetails(eventType: EventType){
    this.eventsToViewList = [];
    this.companySummary?.lastEvents?.forEach( (event: Event) =>{
      if(event.eventType == eventType ){
        this.eventsToViewList.push(event);
      }
    })
    if(this.eventsToViewList.length > 0)
      this.showEventDetailsDialog = true;
  }

  getDate(timesTamp: number){
    let date = new Date(timesTamp);
    let d = date.getDate().toString().padStart(2, '0');
    let m = (date.getMonth() + 1).toString().padStart(2, '0');
    let y = date.getFullYear();
    return `${d}-${m}-${y}`;  }


  downloadDocument(doc: Document) {
    this.sharedHelper.spinnerShow();
    fetch(doc.url)
      .then(res => res.blob())
      .then(blob => {
        let type: string = 'application/octet-stream';
        if (doc.type === 'pdf') type = 'application/pdf';
        else if (doc.type === 'doc') type = 'application/msword';
        else if (doc.type === 'docx') type = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        else if (['jpg', 'jpeg'].includes(doc.type || '')) type = `image/jpeg`;
        else if (doc.type === 'svg') type = 'image/svg+xml';
        else if (['png','gif', 'webp'].includes(doc.type || '')) type = `image/${doc.type}`;


        const typedBlob  = new Blob([blob], { type: type });
        const url = URL.createObjectURL(typedBlob );

        const a = document.createElement('a');
        a.href = url;
        a.download = doc.name;
        a.target = '_blank';
        a.click();
        URL.revokeObjectURL(url);
        this.sharedHelper.spinnerHide();
      });
  }

  protected readonly length = length;
  protected readonly EventType = EventType;
}
