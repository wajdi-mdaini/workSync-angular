import { Injectable } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ApiResponse, SharedSettings, User} from './models';
import {SharedHelper} from './shared-helper';
import {MessageService} from 'primeng/api';
import {Router} from '@angular/router';
import {AuthService} from './auth-service';
@Injectable({
  providedIn: 'root'
})
export class Shared {
  sharedSettings: SharedSettings = {
    verificationCodeLength: 0,
    verificationCodeExpireIn: 0
  };
  principal!: User;
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
      if(httpResponse.status == 0)
        this.messageService.add({ severity: 'error', summary: 'Error', detail: translate.instant('error_status_0'), life: 3000});
      if((httpResponse.status == 'LOCKED' || httpResponse.status == 'INTERNAL_SERVER_ERROR') && httpResponse.showToast)
        this.messageService.add({ severity: 'error', summary: 'Error', detail: translate.instant(httpResponse.messageLabel), life: 3000});
      if((httpResponse.status == 'CONFLICT' || httpResponse.status == 'UNAUTHORIZED') && httpResponse.showToast)
        this.messageService.add({ severity: 'warn', summary: 'Warning !', detail: translate.instant(httpResponse.messageLabel), life: 3000});
      if(httpResponse.status == 'OK' && httpResponse.showToast)
        this.messageService.add({ severity: 'success', summary: 'Success', detail: this.translate.instant(httpResponse.messageLabel), life: 3000});

      if(httpResponse.doLogout) this.logout()
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
    // TODO other logout instructions
    this.router.navigate(['/auth/login']);
  }

  applyTranslation(){
    // default + auto-detect browser language (basic example)
    this.translate.setDefaultLang('en');
    const browserLang:string = navigator.language?.split('-')[0] ?? 'en';
    this.selectedLanguage = this.translationLanguagesList.filter( (a) => a.code === browserLang).length !== 0 ?
      this.translationLanguagesList.filter( (a) => a.code === browserLang)[0] :
      this.translationLanguagesList[0]
    this.translate.use(this.selectedLanguage.code);
  }
  switchLang() {
    this.translate.use(this.selectedLanguage.code);
  }
}
