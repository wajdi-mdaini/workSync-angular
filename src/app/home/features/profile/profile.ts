import { Component } from '@angular/core';
import {ManageProfile} from '../../../dashboard/features/manage-profile/manage-profile';

@Component({
  selector: 'app-profile',
  imports: [
    ManageProfile
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile {

}
