import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ApiResponse, Role, TeamDetailsResponse, User} from '../../../services/models';
import {TranslatePipe} from '@ngx-translate/core';
import {Dialog} from 'primeng/dialog';
import {NgIf} from '@angular/common';
import {PublicService} from '../../../services/public-service';

@Component({
  selector: 'app-profile',
  imports: [
    TranslatePipe,
    Dialog,
    NgIf
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile implements OnInit {
  @Input() user?: User;
  @Output() userChange = new EventEmitter<User>();
  showProfilePictureDialog: boolean = false;
  teamsNumber: number = 0;
  employeeNumber: number = 0;
  constructor(private publicService: PublicService) {
  }
    ngOnInit(): void {
    this.teamsNumber = 0;
    this.employeeNumber = 0;
    if(this.user && this.user.role == Role.MANAGER)
      this.publicService.getTeamMembers(this.user?.email).subscribe({
        next: (apiResponse: ApiResponse) => {
          if(apiResponse.success){
            apiResponse.data.forEach((teamDetailsResponse: TeamDetailsResponse) => {
              if(teamDetailsResponse.manager.email == this.user?.email){
                this.employeeNumber += teamDetailsResponse.members.length
                this.teamsNumber ++;
              }

            })
          }
        },
        error: (err) => {console.log(err)},
      })
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
