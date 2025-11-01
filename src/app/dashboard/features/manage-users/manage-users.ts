import {Component, OnInit} from '@angular/core';
import {ManagerService} from '../../../services/manager-service';
import {ApiResponse, GetUsersRequest, User} from '../../../services/models';
import {Shared} from '../../../services/shared';
import {NgIf} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';
import {UsersList} from './users-list/users-list';
import {UserForm} from './user-form/user-form';
import {UserView} from './user-view/user-view';
import {OrderChart} from '../order-chart/order-chart';

@Component({
  selector: 'app-manage-users',
  imports: [
    NgIf,
    TranslatePipe,
    UsersList,
    UserForm,
    UserView,
    OrderChart
  ],
  templateUrl: './manage-users.html',
  styleUrl: './manage-users.scss'
})
export class ManageUsers implements OnInit {
  screenHeaderLabel: string = 'manage_users_default_header';
  usersList!: User[];
  userToEdit!: User;
  userToView!: User;
  showAddDialog: boolean = false;
  showEditDialog: boolean = false;
  showViewDialog: boolean = false;
  showOrderChart: boolean = false;
  constructor(private sharedService: Shared,
              private managerService: ManagerService) {
  }

  ngOnInit(): void {
        this.getUsers()
  }

  getUsers(){
    let getUsersRequest: GetUsersRequest = {
      userEmail: this.sharedService.principal.email,
      companyId: this.sharedService.company.id
    }
    this.managerService.getUsers(getUsersRequest).subscribe({
      next: (response: ApiResponse) => {
        this.usersList = response.data;
      },
      error: error => { console.log(error); }
    })
  }

  doEdit(event: any) {
    this.userToEdit = event;
    this.showEditDialog = true;
  }

  doView(event: any) {
    this.userToView = event;
    this.showViewDialog = true;
  }

  doAddUser(){
    this.showAddDialog = true;
  }

  editUserInList(data: User){
    let index: number = this.usersList.findIndex( u => u.email === data.email);
    if(index > -1){
      this.usersList[index] = data
    }else{
      // Add new user at the beginning
      this.usersList.unshift(data)
    }
  }
}
