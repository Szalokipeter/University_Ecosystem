import { Component } from '@angular/core';
import { HomeLogoComponent } from '../../shared/home-logo/home-logo.component';
import { NgIf } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { UserModel } from '../../../models/user.model';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Router } from '@angular/router';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { MatIcon } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { ClickOutsideDirective } from '../../../directives/click-outside.directive';

@Component({
  selector: 'app-portal-header',
  imports: [
    HomeLogoComponent,
    NgIf,
    RouterLink,
    MatIcon,
    MatDividerModule,
    ClickOutsideDirective,
    RouterLinkActive
  ],
  templateUrl: './portal-header.component.html',
  styleUrl: './portal-header.component.css',
  animations: [
    trigger('rotateChevron', [
      state('closed', style({ transform: 'rotate(0deg)' })),
      state('open', style({ transform: 'rotate(-90deg)' })),
      transition('closed => open', [
        animate('200ms ease-out', style({ transform: 'rotate(-90deg)' })),
      ]),
      transition('open => closed', [
        animate('200ms ease-in', style({ transform: 'rotate(0deg)' })),
      ]),
    ]),
    trigger('fadeInDropdown', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate(
          '150ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
      transition(':leave', [
        animate(
          '100ms ease-in',
          style({ opacity: 0, transform: 'translateY(-10px)' })
        ),
      ]),
    ]),
  ],
})
export class PortalHeaderComponent {
  loggedInUser: UserModel | undefined = undefined;
  username: string | null = null;
  usernameInitial: string = '';
  isDropdownOpen = false;
  activeView: 'dashboard' | 'todos' = 'dashboard';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '');
    this.username = this.loggedInUser?.username || null;
    this.usernameInitial = this.username?.charAt(0).toUpperCase() || '';
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['login']);
  }

  navigateTo(view: 'dashboard' | 'todos') {
    this.activeView = view;
    this.router.navigate([`/portal/${view}`]);
  }
}
