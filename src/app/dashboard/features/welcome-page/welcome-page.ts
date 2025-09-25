import { Component } from '@angular/core';
import {PublicService} from '../../../services/public-service';
import {ApiResponse} from '../../../services/models';
import {Shared} from '../../../services/shared';
import {SummaryCards} from '../../summary-cards/summary-cards';

@Component({
  selector: 'app-welcome-page',
  imports: [
    SummaryCards
  ],
  templateUrl: './welcome-page.html',
  styleUrl: './welcome-page.scss'
})
export class WelcomePage {
  selectedFile: File | null = null;
  userEmail = 'wajdimd@gmail.com';
  constructor(private publicService: PublicService, private sharedService: Shared) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }


}
