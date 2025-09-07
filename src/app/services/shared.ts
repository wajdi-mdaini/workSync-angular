import { Injectable } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class Shared {
  selectedLanguage: any;
  translationLanguagesList: any[] = [
    { name: 'English', code: 'en' },
    { name: 'French', code: 'fr' },
    { name: 'Dutch', code: 'nl' },
    { name: 'German', code: 'ge' }
  ];
  constructor(private translate: TranslateService) {}

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
