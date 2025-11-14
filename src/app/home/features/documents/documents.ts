import { Component } from '@angular/core';
import {ManageDocument} from '../../../dashboard/features/manage-document/manage-document';

@Component({
  selector: 'app-documents',
  imports: [
    ManageDocument
  ],
  templateUrl: './documents.html',
  styleUrl: './documents.scss'
})
export class Documents {

}
