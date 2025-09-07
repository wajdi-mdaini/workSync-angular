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
  currentPath: string = ''
  constructor(public sharedService:Shared,private router: Router) {
    this.currentPath = this.router.url;
  }

  get getWelcomeText(){
    return this.currentPath.includes('login') ? 'auth_body_welcome_login_message' : 'auth_body_welcome_signup_message'
  }
}
