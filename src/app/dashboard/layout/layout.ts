import { Component } from '@angular/core';
import {Sidenav} from '../sidenav/sidenav';
import {Navbar} from '../navbar/navbar';
import {SummaryCards} from '../summary-cards/summary-cards';
import {Footer} from '../footer/footer';
import {Branding} from '../branding/branding';
import {RouterOutlet} from '@angular/router';
import {ApiResponse, Role} from '../../services/models';
import {AuthService} from '../../services/auth-service';
import {Shared} from '../../services/shared';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-layout',
  imports: [
    Sidenav,
    Navbar,
    Footer,
    Branding,
    RouterOutlet,
    NgIf
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class Layout {
  constructor(public sharedService: Shared) {
  }

  protected readonly Role = Role;
}
