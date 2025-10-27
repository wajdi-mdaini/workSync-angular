import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Shared} from '../../services/shared';
import {TranslatePipe} from '@ngx-translate/core';
import {NavigationEnd, Router} from '@angular/router';
import {filter} from 'rxjs';

@Component({
  selector: 'app-sidenav',
  imports: [
    TranslatePipe
  ],
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.scss'
})
export class Sidenav implements OnInit,AfterViewInit {
  showGuide: boolean = false;
  selectedMenuLinkClasses: string[] = ['bg-blue-500/13', 'font-semibold', 'text-slate-700']
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
        }
  }
  toggleGuide(){
    this.showGuide = ! this.showGuide;
    let div = document.getElementById("document-guide");
    !this.showGuide ? div?.style.setProperty('display', 'none') : div?.style.setProperty('display', 'flex');
  }
  navigate(path: string,screenTitle: string){
    this.clearHighlight();
    if(screenTitle == 'navbar_screen_title_dashboard') this.doHighlight("dashboard-link")
    else if (screenTitle == 'navbar_screen_title_manage_profile') this.doHighlight("profile-link");
    else if (screenTitle == 'navbar_screen_title_manage_company') this.doHighlight("company-link");
    else if (screenTitle == 'navbar_screen_title_manage_teams') this.doHighlight("teams-link");
    else if (screenTitle == 'navbar_screen_title_manage_users') this.doHighlight("users-link");
    this.sharedService.customNavigation(path,screenTitle)
  }
  doHighlight(elementId: string){
    document.getElementById(elementId)?.classList.add(this.selectedMenuLinkClasses[0],this.selectedMenuLinkClasses[1],this.selectedMenuLinkClasses[2]);
  }
  clearHighlight(){
    let links = document.getElementsByClassName("bg-blue-500/13")
    for(let link of links){
      link.classList.remove(this.selectedMenuLinkClasses[0],this.selectedMenuLinkClasses[1],this.selectedMenuLinkClasses[2]);
    }
  }
  doLogout(){
    this.sharedService.logout();
  }
}
