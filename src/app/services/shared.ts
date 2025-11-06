import { Injectable } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ApiResponse, Company, SharedSettings, User} from './models';
import {SharedHelper} from './shared-helper';
import {MessageService} from 'primeng/api';
import {NavigationEnd, Router} from '@angular/router';
import {AuthService} from './auth-service';
import {filter} from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class Shared {
  isMenuShown: boolean = false;
  menu:any;
  isDarkModeActive: boolean = false;
  isFixedNavBarActive: boolean = false;
  navBarScreenTitleLabel: string = '';
  sharedSettings: SharedSettings = {
    verificationCodeLength: 0,
    verificationCodeExpireIn: 0
  };
  principal!: User;
  company!: Company;
  selectedLanguage: any;
  translationLanguagesList: any[] = [
    { name: 'English', code: 'en' },
    { name: 'French', code: 'fr' },
    { name: 'Dutch', code: 'nl' },
    { name: 'German', code: 'ge' }
  ];
  constructor(private router: Router,
              private translate: TranslateService,
              private sharedHelper: SharedHelper,
              private messageService: MessageService,
              private authService: AuthService) {
    // intercepted error via JWT interceptor
    sharedHelper.httpStatus$.subscribe((httpResponse: ApiResponse) => {
      if(httpResponse?.status == 0)
        this.messageService.add({ severity: 'error', summary: 'Error', detail: translate.instant('error_status_0'), life: 3000});
      if((httpResponse?.status == 'LOCKED' || httpResponse?.status == 'INTERNAL_SERVER_ERROR') && httpResponse?.showToast)
        this.messageService.add({ severity: 'error', summary: 'Error', detail: translate.instant(httpResponse?.messageLabel), life: 3000});
      if((httpResponse?.status == 'CONFLICT' || httpResponse?.status == 'UNAUTHORIZED') && httpResponse?.showToast)
        this.messageService.add({ severity: 'warn', summary: 'Warning !', detail: translate.instant(httpResponse?.messageLabel), life: 3000});
      if(httpResponse?.status == 'OK' && httpResponse?.showToast)
        this.messageService.add({ severity: 'success', summary: 'Success', detail: this.translate.instant(httpResponse?.messageLabel), life: 3000});

      if(httpResponse?.doLogout) this.logout()
    })
    this.authService.getSharedSettings().subscribe({
      next: (apiResponse: ApiResponse) => {
        if (apiResponse.success){
          this.sharedSettings = apiResponse.data;
          console.log('Shared settings loaded', apiResponse.data);
        }else this.messageService.add({ severity: 'error', summary: 'Error', detail: translate.instant('error_status_INTERNAL_SERVER_ERROR'), life: 3000});
      },
      error: (err) => {
        console.error('Error fetching shared settings', err)
        this.messageService.add({ severity: 'error', summary: 'Error', detail: translate.instant('error_status_INTERNAL_SERVER_ERROR'), life: 3000});
      }

    });

  }

  logout(){
    this.authService.logout().subscribe(success => {
      this.router.navigate(['/auth/login']);
    })
  }

  applyTranslation(){
    const browserLang:string = navigator.language?.split('-')[0] ?? 'en';
    let preferredLanguageCode: any = '';
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      preferredLanguageCode = localStorage.getItem('preferredLanguage');
    }
    if(preferredLanguageCode && preferredLanguageCode != '') {
      let preferredLanguageName: any = this.translationLanguagesList.filter( (a) => a.code === preferredLanguageCode)[0]?.name;
      this.selectedLanguage = {name: preferredLanguageName, code: preferredLanguageCode}
    }
    else{
      this.selectedLanguage = this.translationLanguagesList.filter( (a) => a.code === browserLang).length !== 0 ?
        this.translationLanguagesList.filter( (a) => a.code === browserLang)[0] :
        this.translationLanguagesList[0]
    }
    this.translate.use(this.selectedLanguage.code);
  }
  switchLang() {
    this.translate.use(this.selectedLanguage.code);
    localStorage.setItem('preferredLanguage',this.selectedLanguage.code);
  }

  customNavigation(routerLink: string,screenTitle?: string) {
    if (screenTitle != null) {
      this.navBarScreenTitleLabel = screenTitle;
    }
    this.router.navigate([routerLink]);
  }

  setCompanyAndApplyBranding(company: Company): void {

      this.company = company;
      const root = document.documentElement;
      company.branding?.forEach(brand => {
        if (brand.label == "mode") {
          let root_html = document.querySelector("html");
          if (brand.value == "dark") {
            root_html?.classList.add("dark");
            this.isDarkModeActive = true;
          } else if (brand.value == "light") {
            root_html?.classList.remove("dark");
            this.isDarkModeActive = false;
          }
        } else if (brand.label == "navbar") {
          setTimeout(() => {
            let navbar = document.querySelector("[navbar-main]");
            if (brand.value == "fixed") {
              this.applyFixedNavBar(navbar);
              this.isFixedNavBarActive = true;
            } else if (brand.value == "default") {
              this.disableFixedNavBar(navbar)
              this.isFixedNavBarActive = false;
            }
          }, 1000);
        } else {
          root.style.setProperty(brand.label, brand.value);
        }
      })

  }

  applyFixedNavBar(navbar: any){
    navbar?.setAttribute("navbar-scroll", "true");
    navbar?.classList.add("sticky");
    navbar?.classList.add("top-[1%]");
    navbar?.classList.add("backdrop-saturate-200");
    navbar?.classList.add("backdrop-blur-2xl");
    navbar?.classList.add("dark:bg-slate-850/80");
    navbar?.classList.add("dark:shadow-dark-blur");
    navbar?.classList.add("bg-[hsla(0,0%,100%,0.8)]");
    navbar?.classList.add("shadow-blur");
    navbar?.classList.add("z-110");
    navbar?.classList.add("breadcrumb-text-color");
  }

  disableFixedNavBar(navbar: any){
    navbar?.setAttribute("navbar-scroll", "false");
    navbar?.classList.remove("sticky");
    navbar?.classList.remove("top-[1%]");
    navbar?.classList.remove("backdrop-saturate-200");
    navbar?.classList.remove("backdrop-blur-2xl");
    navbar?.classList.remove("dark:bg-slate-850/80");
    navbar?.classList.remove("dark:shadow-dark-blur");
    navbar?.classList.remove("bg-[hsla(0,0%,100%,0.8)]");
    navbar?.classList.remove("shadow-blur");
    navbar?.classList.remove("z-110");
    navbar?.classList.remove("breadcrumb-text-color");
  }

  toggleMenu(){
    this.menu = document.getElementsByTagName('aside')[0]
    if(this.menu && this.isMenuShown){
      this.menu.classList.remove('translate-x-0');
      this.menu.classList.add('-translate-x-full');
      this.isMenuShown = false
    }else if(this.menu && !this.isMenuShown){
      this.isMenuShown = true;
      this.menu.classList.remove('-translate-x-full');
      this.menu.classList.add('translate-x-0');
    }
  }
}
