import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'timeAgo',
  standalone: true
})
export class TimeAgoPipe implements PipeTransform {

  constructor(private translate: TranslateService) {}

  transform(value: string | Date): string {
    if (!value) return '';

    const now = new Date();
    const date = new Date(value);
    const diffMs = now.getTime() - date.getTime();

    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    const diffMonths = Math.floor(diffDays / 30);   // approx
    const diffYears = Math.floor(diffDays / 365);   // approx

    if (diffMinutes < 1) {
      return this.translate.instant('time.justNow');
    } else if (diffMinutes < 60) {
      return this.translate.instant(
        diffMinutes === 1 ? 'time.minutesAgo' : 'time.minutesAgo_plural',
        { count: diffMinutes }
      );
    } else if (diffHours < 24) {
      return this.translate.instant(
        diffHours === 1 ? 'time.hoursAgo' : 'time.hoursAgo_plural',
        { count: diffHours }
      );
    } else if (diffDays < 30) {
      return this.translate.instant(
        diffDays === 1 ? 'time.daysAgo' : 'time.daysAgo_plural',
        { count: diffDays }
      );
    } else if (diffDays < 365) {
      return this.translate.instant(
        diffMonths === 1 ? 'time.monthsAgo' : 'time.monthsAgo_plural',
        { count: diffMonths }
      );
    } else {
      return this.translate.instant(
        diffYears === 1 ? 'time.yearsAgo' : 'time.yearsAgo_plural',
        { count: diffYears }
      );
    }
  }
}
