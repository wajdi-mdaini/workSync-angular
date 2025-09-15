import {Component, CUSTOM_ELEMENTS_SCHEMA, signal} from '@angular/core';
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
  protected readonly title = signal('angular-demo');
  constructor(private sharedService: Shared,public sharedHelper: SharedHelper,private authService: AuthService) {
    sharedService.applyTranslation();
  }

}
