import { Component } from '@angular/core';
import { HomeLogoComponent } from '../home-logo/home-logo.component';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [HomeLogoComponent, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  constructor(public authService: AuthService) {}

  toggle_menu(event: MouseEvent) {
    const button = event.target as HTMLButtonElement;    
    if (button.classList.contains('header__toggle-menu--active')) {
      button.classList.remove('header__toggle-menu--active')  
    } else {
      button.classList.add('header__toggle-menu--active');
    }
  }
}
