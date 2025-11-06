import {Component, ViewChild} from '@angular/core';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {RouterOutlet} from '@angular/router';
import {AddTeamRequest, ApiResponse, Company, EditTeamRequest, Team, User} from '../../../services/models';
import {CompanyService} from '../../../services/company-service';
import {Shared} from '../../../services/shared';
import {TeamsList} from './teams-list/teams-list';
import {TeamForm} from './team-form/team-form';
import {NgIf} from '@angular/common';
import {ManagerService} from '../../../services/manager-service';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-manage-teams',
  imports: [
    TranslatePipe,
    TeamsList,
    TeamForm,
    NgIf
  ],
  templateUrl: './manage-teams.html',
  styleUrl: './manage-teams.scss'
})
export class ManageTeams {
  @ViewChild(TeamForm) teamForm!: TeamForm;
  screenHeaderLabel: string = 'manage_teams_default_header';
  teams: Team[] = []
  showTeamsList: boolean = true;
  showAddLink: boolean = true;
  addTeam: boolean = false;
  showTeamForm: boolean = false;
  showCancelEditingLink: boolean = false;
  showCancelAddingLink: boolean = false;
  teamToEdit?: Team;
  constructor(private companyService: CompanyService,
              private managerService: ManagerService,
              private messageService: MessageService,
              private translate: TranslateService,
              private sharedService: Shared) {
    this.getAllTeams()
  }
  getAllTeams(){
    let company: Company = this.sharedService.company
    if(company) {
      this.managerService.getCompanyTeams(company.id).subscribe({
        next: (apiResponse: ApiResponse) => {
          this.teams = apiResponse.data;
        },
        error: err => console.log(err)
      })
    }
  }
  editTeam(team: any){
    this.teamToEdit = team;
    this.showTeamsList = false;
    this.showAddLink = false;
    this.showTeamForm = true;
    this.addTeam = false;
    this.showCancelEditingLink = true
    this.showCancelAddingLink = false
    this.screenHeaderLabel = 'manage_teams_edit_team_header'
  }
  cancelEditing(){
    this.teamToEdit = undefined;
    this.showTeamsList = true;
    this.showAddLink = true;
    this.showTeamForm = false;
    this.showCancelEditingLink = false
    this.showCancelAddingLink = false
    this.addTeam = false
    this.screenHeaderLabel = 'manage_teams_default_header'
  }
  addNewTeam(){
    this.showTeamsList = false;
    this.showAddLink = false;
    this.showTeamForm = false;
    this.showCancelEditingLink = false
    this.showCancelAddingLink = true
    this.addTeam = true;
    this.screenHeaderLabel = 'manage_teams_add_team_header'
  }
  cancelAdding(){
    this.cancelEditing();
  }

  doSave(){
    if(this.teamForm.formGroup.invalid) return
    if(this.teamForm.targetUsers == null || this.teamForm.targetUsers.length == 0){
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: this.translate.instant('manage_teams_edit_team_empty_target_users_list'), life: 3000});
      return;
    }
    if(this.teamToEdit){
      let newTeam: Team = this.teamToEdit
      newTeam.manager = this.teamForm.formGroup.get('manager')?.value
      newTeam.description = this.teamForm.formGroup.get('description')?.value
      newTeam.name = this.teamForm.formGroup.get('name')?.value
      let editTeamRequest: EditTeamRequest = {
        remainingUsers: this.getEmailList(this.teamForm.allUsers),
        teamMembers: this.getEmailList(this.teamForm.targetUsers),
        team: newTeam,
        managerEmail: this.teamForm.formGroup.get('manager')?.value?.email
      };
      this.managerService.editTeam(editTeamRequest).subscribe({
        next: (apiResponse: ApiResponse) => {
          if(apiResponse.success){
            if(this.teamToEdit){
              let index: number = this.teams.indexOf(this.teamToEdit)
              this.teams[index] = apiResponse.data;
              this.cancelEditing();
            }
          }
        },
        error: err => console.log(err)
      })
    }
    console.log(this.teamForm.formGroup.value)
  }

  private getEmailList(users: User[]) {
    let emails: string[] = [];
    users.forEach(user => emails.push(user.email))
    return emails;
  }

  doSaveAdding(){
    if(this.teamForm.formGroup.invalid) return
    if(this.teamForm.targetUsers == null || this.teamForm.targetUsers.length == 0){
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: this.translate.instant('manage_teams_edit_team_empty_target_users_list'), life: 3000});
      return;
    }
    if(this.sharedService.principal){
      let newTeam: Team = {} as Team;
      newTeam.manager = this.teamForm.formGroup.get('manager')?.value;
      newTeam.description = this.teamForm.formGroup.get('description')?.value;
      newTeam.name = this.teamForm.formGroup.get('name')?.value;
      newTeam.company = this.sharedService.company;
      newTeam.members = this.teamForm.targetUsers;
      let addTeamRequest: AddTeamRequest = {
        memberEmails: this.getEmailList(this.teamForm.targetUsers),
        team: newTeam,
        managerEmail: this.teamForm.formGroup.get('manager')?.value?.email
      };
      this.managerService.addTeam(addTeamRequest).subscribe({
        next: (apiResponse: ApiResponse) => {
          if (apiResponse.success) {
            this.teams.push(apiResponse.data);
            this.cancelAdding();
          }
        },
        error: err => console.log(err)
      })
    }
  }
}
