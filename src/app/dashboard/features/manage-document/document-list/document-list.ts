import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ApiResponse, Document} from '../../../../services/models';
import {ConfirmDialog} from 'primeng/confirmdialog';
import {TableModule} from 'primeng/table';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {DatePipe, NgIf} from '@angular/common';
import {ConfirmationService} from 'primeng/api';
import {SharedHelper} from '../../../../services/shared-helper';
import {ManagerService} from '../../../../services/manager-service';
import {PublicService} from '../../../../services/public-service';

@Component({
  selector: 'app-document-list',
  imports: [
    ConfirmDialog,
    TableModule,
    TranslatePipe,
    DatePipe,
    NgIf
  ],
  templateUrl: './document-list.html',
  styleUrl: './document-list.scss',
  providers: [ConfirmationService]
})
export class DocumentList {
  @Input() documentsFrom: Document[] = [];
  @Output() documentsFromChange = new EventEmitter();
  @Input() documentsTo: Document[] = [];
  @Output() documentsToChange = new EventEmitter();
  @Output() documentToEdit = new EventEmitter<Document>();

  constructor(private sharedHelper: SharedHelper,
              private translate: TranslateService,
              private publicService: PublicService,
              private confirmationService: ConfirmationService) {
  }
  doEdit(document: Document) {
    this.documentToEdit.emit(document);
  }

  doConfirmDelete(event: any,document: Document) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: this.translate.instant('manage_document_delete_document_dialog_message'),
      header: this.translate.instant('manage_document_delete_document_dialog_header'),
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
        this.publicService.deleteDocument(document.id).subscribe({
          next: (apiResponse: ApiResponse) => {
            if(apiResponse.success) {
              this.documentsFrom = this.documentsFrom.filter(d => d.id !== apiResponse.data?.id);
              this.documentsFromChange.emit(this.documentsFrom);
            }
          },
          error: (err) => {console.log(err);},
        })
      }
    });
  }

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
}
