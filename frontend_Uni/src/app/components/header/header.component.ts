import { Component } from '@angular/core';
import { HomeLogoComponent } from '../home-logo/home-logo.component';

@Component({
  selector: 'app-header',
  imports: [HomeLogoComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

}
