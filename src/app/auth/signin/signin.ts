import { Component } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-signin',
    imports: [
        FormsModule,
        ReactiveFormsModule
    ],
  templateUrl: './signin.html',
  styleUrl: './signin.scss'
})
export class Signin {

}
