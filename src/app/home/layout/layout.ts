import { Component } from '@angular/core';
import {Router, RouterOutlet} from "@angular/router";
import {FormsModule} from '@angular/forms';
import {Footer} from '../../dashboard/footer/footer';
import {Navbar} from '../navbar/navbar';

@Component({
  selector: 'app-layout',
  imports: [
    RouterOutlet,
    FormsModule,
    Footer,
    Navbar
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class Layout {
}
