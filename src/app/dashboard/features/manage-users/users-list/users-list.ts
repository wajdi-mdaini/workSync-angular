import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TableModule} from "primeng/table";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {ApiResponse, Team, User} from '../../../../services/models';
import {ConfirmDialog} from 'primeng/confirmdialog';
import {ConfirmationService, MessageService} from 'primeng/api';
import {ButtonModule} from 'primeng/button';
import {ToastModule} from 'primeng/toast';
import {ManagerService} from '../../../../services/manager-service';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-users-list',
  imports: [
    TableModule,
    TranslatePipe,
    ConfirmDialog,
    ButtonModule,
    ConfirmDialog,
    ToastModule,
    NgIf
  ],
  templateUrl: './users-list.html',
  styleUrl: './users-list.scss',
  providers: [ConfirmationService]
})
export class UsersList {
    @Input() users: User[] = [];
    @Output() usersChange = new EventEmitter();
    @Output() userToEdit = new EventEmitter();
    @Output() userToView = new EventEmitter();

  constructor(private confirmationService: ConfirmationService,
              private translate: TranslateService,
              private managerService: ManagerService) {
  }

  doEdit(user: User) {
    this.userToEdit.emit(user);
  }

  doView(user: User) {
    this.userToView.emit(user);
  }

  doConfirmDelete(event: Event,user: User) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: this.translate.instant('manage_users_delete_user_confirm_dialog_message'),
      header: this.translate.instant('manage_users_delete_user_confirm_dialog_header'),
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
        this.managerService.deleteUser(user.email).subscribe({
          next: (apiResponse: ApiResponse) => {
            if(apiResponse.success) {
              this.users = this.users.filter(u => u.email !== apiResponse.data);
              this.usersChange.emit(this.users);
            }
          },
          error: (err) => {console.log(err);},
        })
      }
    });
  }

  unlockUser(event: Event,user: User) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: this.translate.instant('manage_users_unlock_user_confirm_dialog_message'),
      header: this.translate.instant('manage_users_unlock_user_confirm_dialog_header'),
      icon: 'fa fa-info-circle',
      rejectLabel: this.translate.instant('button_cancel'),
      rejectButtonProps: {
        label: this.translate.instant('button_cancel'),
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: this.translate.instant('button_unlock'),
        severity: 'success',
      },

      accept: () => {
        this.managerService.unlockUser(user.email).subscribe({
          next: (apiResponse: ApiResponse) => {
            if(apiResponse.success) {
              let index  = this.users.indexOf(user)
              this.users[index] = apiResponse.data;
              this.usersChange.emit(this.users);
            }
          },
          error: (err) => {console.log(err);},
        })
      }
    });
  }
}
