import {Component, EventEmitter, Input, Output} from '@angular/core';
import {User} from '../../../../services/models';
import {Dialog} from 'primeng/dialog';
import {TranslatePipe} from '@ngx-translate/core';
import {Profile} from '../../profile/profile';
import {OrderChart} from '../../order-chart/order-chart';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-user-view',
  imports: [
    Dialog,
    TranslatePipe,
    Profile,
    NgIf
  ],
  templateUrl: './user-view.html',
  styleUrl: './user-view.scss'
})
export class UserView {
  @Input() user: User = {} as User;
  @Input() showViewDialog: boolean = false;
  @Output() showViewDialogChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input() showOrderChart: boolean = false;
  @Output() showOrderChartChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  hideDialog(){
    this.showViewDialog = false;
    this.showViewDialogChange.emit(false);
  }

  doShowOrderChart(){
  this.showOrderChartChange.emit(true);
  this.hideDialog();
  }
}
