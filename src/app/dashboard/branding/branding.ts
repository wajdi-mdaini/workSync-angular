import { Component } from '@angular/core';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-branding',
  imports: [
    NgClass
  ],
  templateUrl: './branding.html',
  styleUrl: './branding.scss'
})
export class Branding {
  isSlided: boolean = false;

  slideMenu(){
    this.isSlided = !this.isSlided;
  }
}
