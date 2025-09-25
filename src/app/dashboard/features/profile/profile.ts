import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Role, User} from '../../../services/models';
import {TranslatePipe} from '@ngx-translate/core';
import {Dialog} from 'primeng/dialog';
import {NgIf} from '@angular/common';
import {OrderChart} from '../order-chart/order-chart';

@Component({
  selector: 'app-profile',
  imports: [
    TranslatePipe,
    Dialog,
    NgIf,
    OrderChart
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile implements OnInit {
  @Input() user?: User;
  @Output() userChange = new EventEmitter<User>();
  showProfilePictureDialog: boolean = false;
    ngOnInit(): void {

    }

  getAge(timestamp: number | undefined): any {
    if (timestamp) {
      const birthDate = new Date(timestamp);
      const today = new Date();

      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    }else return '?';
    }

  showProfilePicture(){
    this.showProfilePictureDialog = true;
  }

  get getUserFullAddress(): string {
    return [this.user?.address, this.user?.city, this.user?.country, this.user?.postCode]
      .filter(Boolean)
      .join(', ');
  }

  protected readonly Role = Role;
}
