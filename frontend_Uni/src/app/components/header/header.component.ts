import { Component, HostListener } from '@angular/core';
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
    button.classList.toggle('header__toggle-menu--active');
  }

  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth >= 1024) {
      const toggleButton = document.querySelector('.header__toggle-btn');

      if (toggleButton) {
        toggleButton.classList.remove('header__toggle-menu--active');
      }
    }
  }
}
