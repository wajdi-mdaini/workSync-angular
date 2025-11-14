import { Component } from '@angular/core';
import {Holiday} from '../../../home/features/holiday/holiday';

@Component({
  selector: 'app-manage-holidays',
  imports: [
    Holiday
  ],
  templateUrl: './manage-holidays.html',
  styleUrl: './manage-holidays.scss'
})
export class ManageHolidays {

}
