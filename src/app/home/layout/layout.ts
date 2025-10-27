import { Component } from '@angular/core';
import {Shared} from '../../services/shared';

@Component({
  selector: 'app-layout',
  imports: [],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class Layout {
  constructor(private sharedService: Shared) {
  }
}
