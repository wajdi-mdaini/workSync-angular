import { Injectable } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {SharedSettings, User} from './models';
import {SharedHelper} from './shared-helper';
import {MessageService} from 'primeng/api';
import {Router} from '@angular/router';
import {AuthService} from './auth-service';
@Injectable({
  providedIn: 'root'
})
export class Shared {
  sharedSettings: SharedSettings = {
    verificationCodeLength: 0
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
    sharedHelper.errors$.subscribe((errorCode: any) => {
      if(errorCode == 0)
        this.messageService.add({ severity: 'error', summary: 'Error', detail: translate.instant('error_status_0'), life: 3000});
      if(errorCode == 403)
        this.messageService.add({ severity: 'warn', summary: 'Warning !', detail: translate.instant('error_status_403'), life: 3000});
      if(errorCode == 'non existing user')
        this.messageService.add({ severity: 'warn', summary: 'Warning !', detail: translate.instant('error_status_non_existing_user'), life: 3000});
    })
    // intercepted logout via JWT interceptor
    sharedHelper.logout$.subscribe( value => {
      this.logout();
    })
    this.authService.getSharedSettings().subscribe({
      next: (settings: SharedSettings) => {
        this.sharedSettings = settings;
        console.log('Shared settings loaded', settings);
      },
      error: (err) => console.error('Error fetching shared settings', err)
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
