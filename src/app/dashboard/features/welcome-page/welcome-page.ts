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


}
