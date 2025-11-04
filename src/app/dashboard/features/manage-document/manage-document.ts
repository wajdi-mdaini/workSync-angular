import {Component, OnInit} from '@angular/core';
import {NgClass, NgIf} from "@angular/common";
import {TranslatePipe} from "@ngx-translate/core";
import {DocumentList} from './document-list/document-list';
import {ApiResponse, Document, DocumentDTO, Role, User} from '../../../services/models';
import {PublicService} from '../../../services/public-service';
import {Shared} from '../../../services/shared';
import {Dialog} from 'primeng/dialog';
import {FileUpload} from 'primeng/fileupload';
import {environment} from '../../../config/environment';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Select} from 'primeng/select';
import {IftaLabel} from 'primeng/iftalabel';
import {Textarea} from 'primeng/textarea';

@Component({
  selector: 'app-manage-document',
  imports: [
    NgIf,
    TranslatePipe,
    DocumentList,
    Dialog,
    FileUpload,
    FormsModule,
    ReactiveFormsModule,
    Select,
    NgClass,
    IftaLabel,
    Textarea
  ],
  templateUrl: './manage-document.html',
  styleUrl: './manage-document.scss'
})
export class ManageDocument implements OnInit {
  documentListTo: Document[] = []
  documentListFrom: Document[] = []
  documentToEdit: Document = {} as Document;
  showEditDialog: boolean = false;
  showAddDialog: boolean = false;
  uploadClicked: boolean = false;
  screenHeaderLabel: string = 'manage_document_header';
  uploadPath: string = '';
  toUser: User = {} as User;
  toList: User[] = [];
  documentDescriptionAddInput: string = '';
  documentNameInput: string = '';
  documentDescriptionEditInput: string = '';
  constructor(private publicService: PublicService,
              private sharedService: Shared) {}

  ngOnInit(): void {
    this.uploadPath = environment.apiBaseUrl + '/public/upload-document?to=&description=';
    this.getDocuments();
    this.getUsersToList();
  }

  getUsersToList() {
    this.publicService.getToListUsers(this.sharedService.principal.email).subscribe({
      next: (apiResponse: ApiResponse) => {
        if(apiResponse.success)
          this.toList = apiResponse.data;
      },
      error: err => {console.log(err)}
    })
  }

  getDocuments(){
    this.publicService.getDocumentsFrom(this.sharedService?.principal?.email).subscribe({
      next: (apiResponse: ApiResponse) => {
        if(apiResponse.success){
          this.documentListFrom = apiResponse.data;
        }
      },
      error: (err: Error) => {console.log(err)}
    });
    this.publicService.getDocumentsTo(this.sharedService?.principal?.email).subscribe({
      next: (apiResponse: ApiResponse) => {
        if(apiResponse.success){
          this.documentListTo = apiResponse.data;
        }
      },
      error: (err: Error) => {console.log(err)}
    });
  }
  doAddDocument(){
    this.showAddDialog = true;
  }

  doEdit(event: any){
    this.showEditDialog = true;
    this.documentToEdit = event;
    this.toUser = this.documentToEdit.to;
    this.documentNameInput = this.documentToEdit.name;
    this.documentDescriptionEditInput = this.documentToEdit.description;
  }

  get isSaveChangesDisabled():boolean {
    return this.documentToEdit.name == this.documentNameInput &&
      this.documentToEdit.description == this.documentDescriptionEditInput &&
      this.documentToEdit.to.email == this.toUser.email;

  }

  saveChanges(){
    let documentDTO: DocumentDTO = {
      name: this.documentNameInput,
      description: this.documentDescriptionEditInput,
      toUserEmail: this.toUser.email,
      documentId: this.documentToEdit.id
    }
    this.publicService.editDocument(documentDTO).subscribe({
      next: (apiResponse: ApiResponse) => {
        if(apiResponse.success){
          this.showEditDialog = false;
          this.documentToEdit = {} as Document;
          this.toUser = {} as User;
          this.documentNameInput = '';
          this.documentDescriptionEditInput = '';
          let index: number = this.documentListFrom.findIndex( d => d.id === apiResponse.data.id);
          if(index != -1){
            this.documentListFrom[index] = apiResponse.data;
          }
        }
      },
      error: err => {console.log(err)}
    })
  }

  hideAddDialog(){
    this.showAddDialog = false;
  }

  onUpload(event: any) {
    this.uploadClicked = true;
    if(this.toUser.email == null || this.toUser.email == ""){
      return;
    }
    let document: Document = event.originalEvent.body.data
    if(document) {
      this.showAddDialog = false;
      this.uploadClicked = false;
      this.toUser = {} as User;
      this.documentDescriptionAddInput = '';
      let index: number = this.documentListFrom.findIndex( d => d.id === document.id);
      if(index != -1){
        this.documentListFrom[index] = document;
      }else{
        // Add new user at the beginning
        this.documentListFrom.unshift(document);
      }
    }
  }

  setBaseURL(){
    if(this.toUser.email){
      this.uploadPath = environment.apiBaseUrl + '/public/upload-document?to='+ this.toUser.email +'&description='+ this.documentDescriptionAddInput;
    }else{
      this.uploadPath = environment.apiBaseUrl + '/public/upload-document?to=&description='+ this.documentDescriptionAddInput;
    }
  }

  protected readonly Role = Role;
}
