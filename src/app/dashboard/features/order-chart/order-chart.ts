import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { OrganizationChartModule } from 'primeng/organizationchart';
import {TreeNode} from 'primeng/api';
import {Shared} from '../../../services/shared';
import {PublicService} from '../../../services/public-service';
import {ApiResponse, User} from '../../../services/models';
import {CommonModule} from '@angular/common';
import {Dialog} from 'primeng/dialog';
import {TranslatePipe} from '@ngx-translate/core';
@Component({
  selector: 'app-order-chart',
  imports: [OrganizationChartModule,
    CommonModule, Dialog, TranslatePipe
  ],
  templateUrl: './order-chart.html',
  styleUrl: './order-chart.scss'
})
export class OrderChart implements OnInit {
  @Input() doShowOrderChart: boolean = false;
  @Output() doShowOrderChartChange= new EventEmitter<boolean>;
  currentUser?: User
  data: TreeNode[] = []
  constructor(private sharedService: Shared,private publicService: PublicService) {
  }

  ngOnInit(): void {
    this.currentUser = this.sharedService.principal
    this.publicService.getTeamMembers().subscribe({
      next: (apiResponse: ApiResponse) => {
        if(apiResponse.success){
          let teamManager: User = apiResponse.data.teamManager;
          let teamMembers: User[] = apiResponse.data.members;
          let tree: any = {
            expanded: true,
            type: 'person',
            data: {
              teamName:  this.currentUser?.team.name,
              image: teamManager?.profilePictureUrl,
              name: teamManager?.firstname + ' ' + teamManager?.lastname,
              title: teamManager?.role,
              email: teamManager?.email,
            },
          }
          let treeChildren: any[] = [];
          teamMembers.forEach((member: User) => {
            if(member.email != teamManager.email) {
              let row: any = {
                expanded: true,
                type: 'person',
                data: {
                  image: member?.profilePictureUrl,
                  name: member?.firstname + ' ' + member?.lastname,
                  title: member?.role,
                  email: member?.email
                },
                children: []
              }
              treeChildren.push(row)
            }
          })
          tree.children = treeChildren;
          this.data.push(tree);
        }

      },
      error: (error) => {console.log(error)}
    })
  }
  hideDialog(){
    this.doShowOrderChartChange.emit(false);
  }
}
