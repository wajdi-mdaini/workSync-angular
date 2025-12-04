import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Shared} from '../../services/shared';
import {TranslatePipe} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {Role} from '../../services/models';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-sidenav',
  imports: [
    TranslatePipe,
    NgIf
  ],
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.scss'
})
export class Sidenav implements OnInit,AfterViewInit {
  openGuide() {
    window.open('assets/docs/Worksync%20User%20Guide.pdf', '_blank')
  }
  showGuide: boolean = false;
  constructor(public sharedService: Shared,private router: Router) {
  }

  ngAfterViewInit(): void {
      let div = document.getElementById("document-guide");
      if(div) div.style.setProperty("display", "none", "important");
    }

  ngOnInit(): void {
    this.initNavBarScreenTitleLabel()
    }

  initNavBarScreenTitleLabel(){
        let currentUrl = this.router.url;
        this.clearHighlight();
        if(currentUrl.endsWith('dashboard')) {
          this.sharedService.navBarScreenTitleLabel = 'navbar_screen_title_dashboard';
          this.doHighlight("dashboard-link")
        }else if(currentUrl.endsWith('profile')) {
          this.sharedService.navBarScreenTitleLabel = 'navbar_screen_title_manage_profile';
          this.doHighlight("profile-link");
        }else if(currentUrl.endsWith('company')) {
          this.sharedService.navBarScreenTitleLabel = 'navbar_screen_title_manage_company';
          this.doHighlight("company-link");
        }else if(currentUrl.endsWith('teams')) {
          this.sharedService.navBarScreenTitleLabel = 'navbar_screen_title_manage_teams';
          this.doHighlight("teams-link");
        }else if(currentUrl.endsWith('users')) {
          this.sharedService.navBarScreenTitleLabel = 'navbar_screen_title_manage_users';
          this.doHighlight("users-link");
        }else if(currentUrl.endsWith('documents')) {
          this.sharedService.navBarScreenTitleLabel = 'navbar_screen_title_manage_documents';
          this.doHighlight("document-link");
        }else if(currentUrl.endsWith('holidays')) {
          this.sharedService.navBarScreenTitleLabel = 'navbar_screen_title_manage_holidays';
          this.doHighlight("holidays-link");
        }else if(currentUrl.endsWith('events')) {
          this.sharedService.navBarScreenTitleLabel = 'navbar_screen_title_events';
          this.doHighlight("navbar_screen_title_events");
        }
  }
  toggleGuide(){
    this.showGuide = ! this.showGuide;
    let div = document.getElementById("document-guide");
    !this.showGuide ? div?.style.setProperty('display', 'none') : div?.style.setProperty('display', 'flex');
  }
  navigate(path: string,screenTitle: string){
    this.clearHighlight();
    this.sharedService.toggleMenu();
    if(screenTitle == 'navbar_screen_title_dashboard') this.doHighlight("dashboard-link")
    else if (screenTitle == 'navbar_screen_title_manage_profile') this.doHighlight("profile-link");
    else if (screenTitle == 'navbar_screen_title_manage_company') this.doHighlight("company-link");
    else if (screenTitle == 'navbar_screen_title_manage_teams') this.doHighlight("teams-link");
    else if (screenTitle == 'navbar_screen_title_manage_users') this.doHighlight("users-link");
    else if (screenTitle == 'navbar_screen_title_manage_documents') this.doHighlight("document-link");
    else if (screenTitle == 'navbar_screen_title_manage_holidays') this.doHighlight("holidays-link");
    else if (screenTitle == 'navbar_screen_title_events') this.doHighlight("event-link");
    this.sharedService.customNavigation(path,screenTitle)
  }
  doHighlight(elementId: string){
    document.getElementById(elementId)?.classList.add('selected-nav-menu');
  }
  clearHighlight(){
    let links = document.getElementsByClassName("selected-nav-menu")
    for(let link of links){
      link.classList.remove('selected-nav-menu');
    }
  }
  doLogout(){
    this.sharedService.logout();
  }

  protected readonly Role = Role;
}
