import { Component, HostListener, OnInit, Renderer2 } from '@angular/core';
import { HomeLogoComponent } from '../../shared/home-logo/home-logo.component';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { UserModel } from '../../../models/user.model';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { ClickOutsideDirective } from '../../../directives/click-outside.directive';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [
    HomeLogoComponent,
    RouterModule,
    RouterLink,
    MatIconModule,
    MatDividerModule,
    ClickOutsideDirective,
    NgIf,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  loggedInUser: UserModel | undefined = undefined;
  isDropdownOpen = false;

  constructor(
    public authService: AuthService,
    private renderer: Renderer2,
    private router: Router
  ) {}

  ngOnInit() {
    if (localStorage.getItem('loggedInUser')) {
      this.loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '');      
    } else {
      this.loggedInUser = undefined;
    }
    
    this.checkScrollPosition();
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    this.checkScrollPosition();
  }

  private checkScrollPosition = this.debounce(() => {
    const header = document.querySelector('.header');
    if (window.scrollY > 10) {
      this.renderer.addClass(header, 'headroom--not-top');
    } else {
      this.renderer.removeClass(header, 'headroom--not-top');
    }
  }, 50);

  private debounce(func: Function, wait: number) {
    let timeout: any;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  navigateToPortal() {
    this.isDropdownOpen = false;
    this.router.navigate(['/portal']);
  }

  logout() {
    this.authService.logout();
    this.loggedInUser = undefined;
    this.isDropdownOpen = false;
  }

  toggle_menu(event: MouseEvent) {
    const button = event.target as HTMLButtonElement;
    const isActive = button.classList.toggle('header__toggle-menu--active');

    if (isActive) {
      this.renderer.addClass(document.body, 'menu-opened');
    } else {
      this.renderer.removeClass(document.body, 'menu-opened');
    }
  }

  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth >= 1024) {
      const toggleButton = document.querySelector('.header__toggle-btn');

      if (toggleButton) {
        toggleButton.classList.remove('header__toggle-menu--active');
      }

      this.renderer.removeClass(document.body, 'menu-opened');
    }
  }
}
