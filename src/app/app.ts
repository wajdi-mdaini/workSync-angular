import {ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Shared} from './services/shared';
import {Toast} from 'primeng/toast';
import {SharedHelper} from './services/shared-helper';
import {CommonModule} from '@angular/common';
import {AuthService} from './services/auth-service';
import {ApiResponse} from './services/models';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toast,CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class App {
  protected readonly title = signal('worksync-frontend');
  constructor(private sharedService: Shared,
    private cdr: ChangeDetectorRef, public sharedHelper: SharedHelper,private authService: AuthService) {
    sharedService.applyTranslation();
  }

  ngAfterContentChecked() {
    this.cdr.detectChanges(); // Safely re-run change detection when spinner changes to avoid angular console error
  }

}
