import { Component } from '@angular/core';
import { PortalHeaderComponent } from '../../components/portal/portal-header/portal-header.component';
import { DashboardComponent } from '../../components/portal/dashboard/dashboard.component';

@Component({
  selector: 'app-portal',
  imports: [PortalHeaderComponent, DashboardComponent],
  templateUrl: './portal.component.html',
  styleUrl: './portal.component.css'
})
export class PortalComponent {
  
}