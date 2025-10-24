import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TableModule} from "primeng/table";
import {TranslatePipe} from "@ngx-translate/core";
import {Team} from '../../../../services/models';

@Component({
  selector: 'app-teams-list',
    imports: [
        TableModule,
        TranslatePipe
    ],
  templateUrl: './teams-list.html',
  styleUrl: './teams-list.scss'
})
export class TeamsList {
 @Input() teams: Team[] = [];
 @Output() editTeam = new EventEmitter();

 onclickToEdit(team: Team) {
   this.editTeam.emit(team);
 }
}
