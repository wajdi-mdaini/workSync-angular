import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Shared} from './services/shared';
import {Toast} from 'primeng/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toast],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('angular-demo');
  constructor(private sharedService: Shared) {
    sharedService.applyTranslation();
  }

}
