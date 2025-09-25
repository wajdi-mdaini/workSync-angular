import {Component, OnInit} from '@angular/core';
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
export class Sidenav implements OnInit{
  showGuide: boolean = false;
  selectedMenuLinkClasses: string[] = ['bg-blue-500/13', 'font-semibold', 'text-slate-700']
  constructor(public sharedService: Shared,private router: Router) {
  }

  ngOnInit(): void {
    document.getElementById("document-guide")?.style?.setProperty('display', 'none');
    this.initNavBarScreenTitleLabel()
    }

  initNavBarScreenTitleLabel(){
        let currentUrl = this.router.url;
        this.clearHighlight();
        if(currentUrl.endsWith('dashboard')) {
          this.sharedService.navBarScreenTitleLabel = 'navbar_screen_title_dashboard';
          this.doHighlight("dashboard-link")
        }
        if(currentUrl.endsWith('profile')) {
          this.sharedService.navBarScreenTitleLabel = 'navbar_screen_title_manage_profile';
          this.doHighlight("profile-link");
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
}
