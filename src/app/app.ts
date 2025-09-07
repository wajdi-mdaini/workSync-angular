import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslatePipe, TranslateDirective, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,TranslatePipe],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('angular-demo');
  translationLanguagesList: string[] = ['en','fr','nl','ge'];
  constructor(private translate: TranslateService) {
    // default + auto-detect browser language (basic example)
    this.translate.setDefaultLang('en');
    const browserLang:string = navigator.language?.split('-')[0] ?? 'en';
    this.translate.use(this.translationLanguagesList.includes(browserLang) ? browserLang : 'en');
  }

  switchLang(lang:string) {
    this.translate.use(lang);
  }
}
