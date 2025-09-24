import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FileUploadModule} from 'primeng/fileupload';
import {ButtonModule} from 'primeng/button';
import {Dialog} from 'primeng/dialog';
import {NgIf} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';
import {Shared} from '../../../services/shared';
import {environment} from '../../../config/environment';
import {User} from '../../../services/models';

@Component({
  selector: 'app-upload-file-dialog',
  imports: [FileUploadModule,
    ButtonModule, Dialog, NgIf, TranslatePipe
  ],
  templateUrl: './upload-file-dialog.html',
  styleUrl: './upload-file-dialog.scss'
})
export class UploadFileDialog {
  @Input() doChangeProfilePicture: boolean = false;
  @Output() doChangeProfilePictureChange = new EventEmitter<boolean>();
  @Output() newUser = new EventEmitter<User>();
  uploadPath: string = '';
  userEmail: string | undefined;

  constructor( private sharedService: Shared) {
    this.uploadPath = environment.apiBaseUrl + '/public/upload-profile';
  }

  onUpload(event:any) {
    let response: User = event.originalEvent.body.data;
    if(response){
      this.doChangeProfilePictureChange.emit(false);
      this.newUser.emit(response);
    }
  }
}
