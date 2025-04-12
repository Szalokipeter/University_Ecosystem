import { Component } from '@angular/core';
import { PortalHeaderComponent } from '../../components/portal/portal-header/portal-header.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-portal',
  imports: [PortalHeaderComponent, RouterOutlet],
  templateUrl: './portal.component.html',
  styleUrl: './portal.component.css'
})
export class PortalComponent {
  
}