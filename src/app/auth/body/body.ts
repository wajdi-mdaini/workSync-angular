import { Component } from '@angular/core';
import { SelectModule } from 'primeng/select';
import {FormsModule} from '@angular/forms';
import {Shared} from '../../services/shared';
import {TranslatePipe} from '@ngx-translate/core';
import {Router, RouterOutlet} from '@angular/router';
@Component({
  selector: 'app-body',
  imports: [SelectModule, FormsModule, TranslatePipe, RouterOutlet],
  templateUrl: './body.html',
  styleUrl: './body.scss'
})
export class Body {
  currentYear = new Date().getFullYear();
  constructor(public sharedService:Shared,private router: Router) {
  }

  get getWelcomeText(){
    let currentPath = this.router.url;
    if(currentPath.includes('login')) return  'auth_body_welcome_login_message'
    else if(currentPath.includes('signup')) return  'auth_body_welcome_signup_message'
    else if(currentPath.includes('forgetpassword')) return 'auth_body_welcome_forgetpassword_message'

    return 'auth_body_welcome_login_message'
  }
}
