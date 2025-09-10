import { Injectable } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {HttpClient} from '@angular/common/http';
import {SharedSettings} from './models';
import {Observable} from 'rxjs';
import {environment} from '../config/environment';
import {SharedHelper} from './shared-helper';
import {MessageService} from 'primeng/api';
import {Router} from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class Shared {
  sharedSettings: SharedSettings = {
    verificationCodeLength: 0
  };
  selectedLanguage: any;
  translationLanguagesList: any[] = [
    { name: 'English', code: 'en' },
    { name: 'French', code: 'fr' },
    { name: 'Dutch', code: 'nl' },
    { name: 'German', code: 'ge' }
  ];
  constructor(private router: Router,private translate: TranslateService,private http: HttpClient,sharedHelper: SharedHelper,private messageService: MessageService) {
    // intercepted error via JWT interceptor
    sharedHelper.errors$.subscribe((errorCode: number) => {
      if(errorCode == 0)
        this.messageService.add({ severity: 'error', summary: 'Error', detail: translate.instant('error_status_0'), life: 3000});
      if(errorCode == 403)
        this.messageService.add({ severity: 'warn', summary: 'Warning !', detail: translate.instant('error_status_403'), life: 3000});
    })

    sharedHelper.logout$.subscribe( value => {
      this.logout();
    })
    this.getSharedSettings().subscribe({
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
  getSharedSettings(): Observable<SharedSettings> {
    return this.http.get<SharedSettings>(environment.apiBaseUrl+'/auth/settings')
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
