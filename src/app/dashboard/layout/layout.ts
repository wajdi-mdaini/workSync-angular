import { Component } from '@angular/core';
import {Sidenav} from '../sidenav/sidenav';
import {Navbar} from '../navbar/navbar';
import {SummaryCards} from '../summary-cards/summary-cards';
import {Footer} from '../footer/footer';
import {Branding} from '../branding/branding';
import {RouterOutlet} from '@angular/router';
import {ApiResponse} from '../../services/models';
import {AuthService} from '../../services/auth-service';
import {Shared} from '../../services/shared';

@Component({
  selector: 'app-layout',
  imports: [
    Sidenav,
    Navbar,
    SummaryCards,
    Footer,
    Branding,
    RouterOutlet
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class Layout {
  constructor(private authService: AuthService,private sharedService: Shared) {
    // authService.getProfile().subscribe({
    //   next: (apiResponse: ApiResponse) => this.sharedService.principal = apiResponse.data.user,
    //   error: () => console.log('Error getting profile'),
    // });
  }
}
