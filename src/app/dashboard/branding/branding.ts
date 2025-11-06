import {Component, HostListener, OnInit} from '@angular/core';
import {NgClass, NgIf} from '@angular/common';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {CompanyService} from '../../services/company-service';
import {Shared} from '../../services/shared';
import {ApiResponse, Branding as BrandingModel, Company} from '../../services/models';
import {FormsModule} from '@angular/forms';
import {FileUpload} from 'primeng/fileupload';
import {ButtonModule} from 'primeng/button';
import {environment} from '../../config/environment';
import {ConfirmDialog} from 'primeng/confirmdialog';
import {ConfirmationService} from 'primeng/api';

@Component({
  selector: 'app-branding',
  imports: [
    NgClass,
    TranslatePipe,
    FormsModule,
    FileUpload,
    ButtonModule,
    ConfirmDialog,
    NgIf
  ],
  templateUrl: './branding.html',
  styleUrl: './branding.scss',
  providers: [ConfirmationService]
})
export class Branding implements OnInit {
  isSlided: boolean = false;
  bandingDialog!: any;
  showBrandingLink!: any;
  uploadLogo: string = '';
  constructor(private companyService: CompanyService,
              public sharedService: Shared,
              private confirmationService: ConfirmationService,
              private translate: TranslateService,) {
  }

  ngOnInit() {
    this.uploadLogo = environment.apiBaseUrl + '/company/upload-company-logo?id=5';

  }

  slideMenu(){
    this.bandingDialog = document.getElementById('branding-card')
    this.showBrandingLink = document.getElementById('show-branding-card-link')

    this.isSlided = true;
  }

  hideMenu(){
    this.bandingDialog.classList.remove('right-0');
    this.bandingDialog.classList.add('-right-90');
    this.isSlided = false;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (this.isSlided) {
      const target = event.target as HTMLElement;
      if ( target != this.showBrandingLink && (!this.bandingDialog.contains(target) &&
        !target.closest('[fixed-plugin-card]'))) {
        this.bandingDialog.classList.remove('right-0');
        this.bandingDialog.classList.add('-right-90');
        this.isSlided = false;
      }
    }
  }

  setAppTheme(color: string) {
    const root = document.documentElement;

    let currentValue = getComputedStyle(root).getPropertyValue('--dashboard_header_background-color').trim();
    if(currentValue != color) {
      let brandingList: BrandingModel[] = [];
      switch (color) {
        case 'rgb(218, 165, 32)': {
          brandingList.push({ label: '--dashboard_header_background-color', value: 'rgb(218, 165, 32)' } as BrandingModel); // Goldenrod base
          brandingList.push({ label: '--first_button_background-color', value: 'rgb(218, 165, 32)' } as BrandingModel);
          brandingList.push({ label: '--first_button_disabled_background-color', value: 'rgba(218, 165, 32, 0.45)' } as BrandingModel);
          brandingList.push({ label: '--second_button_background-color', value: 'rgb(184, 134, 11)' } as BrandingModel); // Darker gold accent
          brandingList.push({ label: '--second_button_disabled_background-color', value: 'rgba(184, 134, 11, 0.45)' } as BrandingModel);
          brandingList.push({ label: '--selected_menu_li_text_color', value: 'rgb(71, 58, 25)' } as BrandingModel); // Deep bronze text
          brandingList.push({ label: '--selected_menu_li_background_color', value: 'rgba(218, 165, 32, 0.15)' } as BrandingModel); // Soft gold tint
          this.saveNewTheme(brandingList);
          break;
        }
        case 'rgb(39, 41, 49)': {
          brandingList.push({ label: '--dashboard_header_background-color', value: 'rgb(39, 41, 49)' } as BrandingModel); // slightly cooler and smoother
          brandingList.push({ label: '--first_button_background-color', value: 'rgb(78, 86, 105)' } as BrandingModel);
          brandingList.push({ label: '--first_button_disabled_background-color', value: 'rgba(78, 86, 105, 0.45)' } as BrandingModel);
          brandingList.push({ label: '--second_button_background-color', value: 'rgb(52, 59, 72)' } as BrandingModel);
          brandingList.push({ label: '--second_button_disabled_background-color', value: 'rgba(52, 59, 72, 0.45)' } as BrandingModel);
          brandingList.push({ label: '--selected_menu_li_text_color', value: 'rgb(52, 71, 103)' } as BrandingModel);
          brandingList.push({ label: '--selected_menu_li_background_color', value: 'rgb(54 49 49 / 8%)' } as BrandingModel);
          this.saveNewTheme(brandingList);
          break;
        }
        case 'rgb(17, 154, 239)': {
          brandingList.push({ label: '--dashboard_header_background-color', value: 'rgb(17, 154, 239)' } as BrandingModel);
          brandingList.push({ label: '--first_button_background-color', value: 'rgb(17, 154, 239)' } as BrandingModel);
          brandingList.push({ label: '--first_button_disabled_background-color', value: 'rgba(17, 154, 239, 0.45)' } as BrandingModel);
          brandingList.push({ label: '--second_button_background-color', value: 'rgb(8, 110, 190)' } as BrandingModel);
          brandingList.push({ label: '--second_button_disabled_background-color', value: 'rgba(8, 110, 190, 0.45)' } as BrandingModel);
          brandingList.push({ label: '--selected_menu_li_text_color', value: 'rgb(21, 42, 63)' } as BrandingModel);
          brandingList.push({ label: '--selected_menu_li_background_color', value: 'rgba(17, 154, 239, 0.15)' } as BrandingModel);
          this.saveNewTheme(brandingList);
          break;
        }
        case 'rgb(45, 206, 177)': {
          brandingList.push({ label: '--dashboard_header_background-color', value: 'rgb(45, 206, 177)' } as BrandingModel);
          brandingList.push({ label: '--first_button_background-color', value: 'rgb(45, 206, 177)' } as BrandingModel);
          brandingList.push({ label: '--first_button_disabled_background-color', value: 'rgba(45, 206, 177, 0.45)' } as BrandingModel);
          brandingList.push({ label: '--second_button_background-color', value: 'rgb(31, 150, 126)' } as BrandingModel);
          brandingList.push({ label: '--second_button_disabled_background-color', value: 'rgba(31, 150, 126, 0.45)' } as BrandingModel);
          brandingList.push({ label: '--selected_menu_li_text_color', value: 'rgb(21, 45, 40)' } as BrandingModel);
          brandingList.push({ label: '--selected_menu_li_background_color', value: 'rgba(45, 206, 177, 0.15)' } as BrandingModel);
          this.saveNewTheme(brandingList);
          break;
        }
        case '#fb8040': {
          brandingList.push({ label: '--dashboard_header_background-color', value: '#fb8040' } as BrandingModel);
          brandingList.push({ label: '--first_button_background-color', value: '#fb8040' } as BrandingModel);
          brandingList.push({ label: '--first_button_disabled_background-color', value: 'rgba(251, 128, 64, 0.45)' } as BrandingModel);
          brandingList.push({ label: '--second_button_background-color', value: 'rgb(204, 90, 34)' } as BrandingModel);
          brandingList.push({ label: '--second_button_disabled_background-color', value: 'rgba(204, 90, 34, 0.45)' } as BrandingModel);
          brandingList.push({ label: '--selected_menu_li_text_color', value: 'rgb(66, 35, 10)' } as BrandingModel);
          brandingList.push({ label: '--selected_menu_li_background_color', value: 'rgba(251, 128, 64, 0.15)' } as BrandingModel);
          this.saveNewTheme(brandingList);
          break;
        }
        case 'rgb(244, 75, 73)': {
          brandingList.push({ label: '--dashboard_header_background-color', value: 'rgb(244, 75, 73)' } as BrandingModel);
          brandingList.push({ label: '--first_button_background-color', value: 'rgb(244, 75, 73)' } as BrandingModel);
          brandingList.push({ label: '--first_button_disabled_background-color', value: 'rgba(244, 75, 73, 0.45)' } as BrandingModel);
          brandingList.push({ label: '--second_button_background-color', value: 'rgb(200, 50, 48)' } as BrandingModel);
          brandingList.push({ label: '--second_button_disabled_background-color', value: 'rgba(200, 50, 48, 0.45)' } as BrandingModel);
          brandingList.push({ label: '--selected_menu_li_text_color', value: 'rgb(63, 15, 15)' } as BrandingModel);
          brandingList.push({ label: '--selected_menu_li_background_color', value: 'rgba(244, 75, 73, 0.15)' } as BrandingModel);
          this.saveNewTheme(brandingList);
          break;
        }
      }
    }
  }

  saveNewTheme(brandingList: BrandingModel[]){
    this.companyService.setUpBranding(this.sharedService.company.id,brandingList).subscribe({
      next: (apiResponse: ApiResponse) => {
        if(apiResponse.success)
          this.sharedService.setCompanyAndApplyBranding(apiResponse.data);
      },
      error: err => { console.log(err); }
    })
  }

  changeMode(event: any){
    let brandingList: BrandingModel[] = [];
    let root_html = document.querySelector("html");
    if(event.currentTarget.checked) {
      root_html?.classList.add("dark");
      brandingList.push({ label: 'mode', value: 'dark' } as BrandingModel);
    }
    else {
      root_html?.classList.remove("dark");
      brandingList.push({ label: 'mode', value: 'light' } as BrandingModel);
    }
    this.saveNewTheme(brandingList);
  }

  setNavbarStyle(event: any) {
    let navbar = document.querySelector("[navbar-main]");
    let brandingList: BrandingModel[] = [];
    if (event.currentTarget.checked) {
      this.sharedService.applyFixedNavBar(navbar);
      brandingList.push({label: 'navbar', value: 'fixed'} as BrandingModel);
    } else {
      this.sharedService.disableFixedNavBar(navbar)
      brandingList.push({label: 'navbar', value: 'default'} as BrandingModel);
    }
    this.saveNewTheme(brandingList);
  }

  onUpload(event: any) {
    let response: Company = event.originalEvent.body.data;
    if(response){
      this.sharedService.principal.company = response;
      this.sharedService.company = this.sharedService.principal.company;
    }
  }

  doConfirmDelete(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: this.translate.instant('branding_reset_confirm_message'),
      header: this.translate.instant('branding_reset_confirm_header'),
      icon: 'fa fa-info-circle',
      rejectLabel: this.translate.instant('button_cancel'),
      rejectButtonProps: {
        label: this.translate.instant('button_cancel'),
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: this.translate.instant('button_delete'),
        severity: 'danger',
      },

      accept: () => {
        this.companyService.resetBrandingList(this.sharedService.company.id).subscribe({
          next: (apiResponse: ApiResponse) => {
            if(apiResponse.success) {
              window.location.reload();
            }
          },
          error: (err) => {console.log(err);},
        })
      }
    });
  }
}
