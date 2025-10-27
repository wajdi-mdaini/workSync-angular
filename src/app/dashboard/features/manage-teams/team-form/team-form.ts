import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ApiResponse, Role, Team, User} from '../../../../services/models';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {DatePipe, NgClass, NgIf} from '@angular/common';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {IftaLabel} from 'primeng/iftalabel';
import {Textarea} from 'primeng/textarea';
import {PickList} from 'primeng/picklist';
import {PublicService} from '../../../../services/public-service';
import {ManagerService} from '../../../../services/manager-service';
import {MessageService} from 'primeng/api';
import {Router} from '@angular/router';
import {SelectModule} from 'primeng/select';
import {Shared} from '../../../../services/shared';

@Component({
  selector: 'app-team-form',
  imports: [
    ReactiveFormsModule,
    NgClass,
    TranslatePipe,
    IftaLabel,
    Textarea,
    PickList,
    DatePipe,
    SelectModule,
    NgIf
  ],
  templateUrl: './team-form.html',
  styleUrl: './team-form.scss'
})
export class TeamForm implements OnInit {
  @Input() team?: Team;
  formGroup: FormGroup = new FormGroup({});
  allUsers: User[] = [];
  targetUsers: User[] = [];
  managerList: User[] = [];
  constructor(private formBuilder: FormBuilder,
              private managerService: ManagerService,
              private messageService: MessageService,
              private router: Router,
              private translate: TranslateService,
              private sharedService: Shared) {}

  ngOnInit() {
    this.initForms()
    this.initPicklistData();
    this.getManagerList();
  }

  getManagerList(){
    this.managerService.getManagerList(this.sharedService.company.id).subscribe({
      next: (apiResponse: ApiResponse) => {
        if(apiResponse.success)
          this.managerList = apiResponse.data;
      },
      error: err => {console.log(err)}
    })
  }

  get managers(){
    let list = structuredClone(this.managerList);
    list.push(...this.targetUsers);

    // remove duplicates by 'email'
    const unique = list.filter(
      (item, index, self) => index === self.findIndex(u => u.email === item.email)
    );
    return unique;
  }

  addToTargetList(){
    let selectedManager: User = this.formGroup.get('manager')?.value
    if(selectedManager){
      let result: boolean = true;
      this.targetUsers.forEach(user => {
        if(user.email === selectedManager.email) result = false;
      })
      if(result)
      this.moveToTarget({items:[selectedManager]});
    }
  }

  initPicklistData(){
    this.managerService.getAllEmployees(this.sharedService.company.id).subscribe({
      next: (data: ApiResponse) => {
        if(data.success){
          this.allUsers = data.data;
          if(this.allUsers == null || this.allUsers.length == 0){
            this.messageService.add({ severity: 'warn', summary: 'Warning', detail: this.translate.instant('manage_teams_edit_team_empty_source_users_list'), life: 3000});
            this.router.navigate(['/dashboard/teams'])
          }
        }
      },
      error: error => {console.log(error)}
    })
    if(this.team) {
      this.managerService.getTeamMembers(this.team.id).subscribe({
        next: (data: ApiResponse) => {
          if (data.success) {
            this.targetUsers = data.data;
            if (this.team) {
              this.targetUsers.forEach(user => {
                user.teams.forEach(team => {
                  if (team.id == this.team?.id)
                    this.formGroup.get('manager')?.setValue(user)
                })
              })
            }
          }
        },
        error: error => {
          console.log(error)
        }
      })
    }
  }

  initForms(){
    this.formGroup = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      manager: ['', Validators.required]
    })
    if(this.team){
      this.formGroup.get('name')?.setValue(this.team.name)
      this.formGroup.get('description')?.setValue(this.team.description)
    }
  }

  moveToTarget(event: any) {
    let moved = event.items;

    // Remove moved users from source
    this.allUsers = this.allUsers.filter(u => !moved.includes(u));

    // Add moved users to target
    moved.forEach((userToAdd: any) => {
      if(!this.targetUsers.includes(userToAdd))
        this.targetUsers.push(userToAdd);
    });
  }

  moveToSource(event: any) {
    let moved = event.items;

    // Remove moved users from target
    this.targetUsers = this.targetUsers.filter(u => !moved.includes(u));

    // Add moved users back to source
    let manager = this.formGroup.get('manager')?.value;
    moved.forEach((userToAdd: any) => {
      if(!this.allUsers.includes(userToAdd))
        this.allUsers.push(userToAdd);
      if(userToAdd.email == manager.email)
        this.formGroup.get('manager')?.setValue(null);
    });
  }

  protected readonly Role = Role;
}
