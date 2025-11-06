import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TableModule} from "primeng/table";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {ApiResponse, Team} from '../../../../services/models';
import {NgIf} from '@angular/common';
import {ConfirmationService, MessageService} from 'primeng/api';
import {ButtonModule} from 'primeng/button';
import {ToastModule} from 'primeng/toast';
import {ConfirmDialog} from 'primeng/confirmdialog';
import {ManagerService} from '../../../../services/manager-service';

@Component({
  selector: 'app-teams-list',
  imports: [
    TableModule,
    TranslatePipe,
    ButtonModule,
    ConfirmDialog, ToastModule
  ],
  templateUrl: './teams-list.html',
  styleUrl: './teams-list.scss',
  providers: [ConfirmationService]
})
export class TeamsList {
 @Input() teams: Team[] = [];
 @Output() editTeam = new EventEmitter();
 constructor(private confirmationService: ConfirmationService,
             private translate: TranslateService,
             private managerService: ManagerService) {
 }
 onclickToEdit(team: Team) {
   this.editTeam.emit(team);
 }

  doConfirmDelete(event: Event,team: Team) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: this.translate.instant('manage_teams_delete_team_confirm_dialog_message'),
      header: this.translate.instant('manage_teams_delete_team_confirm_dialog_header'),
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
        this.managerService.deleteTeam(team.id).subscribe({
          next: (apiResponse: ApiResponse) => {
            if(apiResponse.success) {
              this.teams = this.teams.filter(u => u.id !== apiResponse.data?.id);
            }
          },
          error: (err) => {console.log(err);},
        })
      }
    });
  }
}
