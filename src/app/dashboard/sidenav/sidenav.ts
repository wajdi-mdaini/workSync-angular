import {Component, OnInit} from '@angular/core';
import {Shared} from '../../services/shared';
import {TranslatePipe} from '@ngx-translate/core';

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
  constructor(public sharedService: Shared) {
  }

  ngOnInit(): void {
    document.getElementById("document-guide")?.style?.setProperty('display', 'none');
    }
  toggleGuide(){
    this.showGuide = ! this.showGuide;
    let div = document.getElementById("document-guide");
    !this.showGuide ? div?.style.setProperty('display', 'none') : div?.style.setProperty('display', 'flex');
  }
  navigate(path: string){
    this.sharedService.customNavigation(path,'navbar_screen_title_manage_profile')
  }
}
