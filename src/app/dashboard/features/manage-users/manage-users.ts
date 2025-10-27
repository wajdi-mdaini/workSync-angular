import {Component, OnInit} from '@angular/core';
import {ManagerService} from '../../../services/manager-service';
import {ApiResponse, GetUsersRequest} from '../../../services/models';
import {Shared} from '../../../services/shared';

@Component({
  selector: 'app-manage-users',
  imports: [],
  templateUrl: './manage-users.html',
  styleUrl: './manage-users.scss'
})
export class ManageUsers implements OnInit {
  constructor(private sharedService: Shared,
              private managerService: ManagerService) {
  }

  ngOnInit(): void {
        this.getUsers()
    }

  getUsers(){
    let getUsersRequest: GetUsersRequest = {
      user: this.sharedService.principal,
      company: this.sharedService.company
    }
    this.managerService.getUsers(getUsersRequest).subscribe({
      next: (response: ApiResponse) => {

      },
      error: error => { console.log(error); }
    })
  }
}
