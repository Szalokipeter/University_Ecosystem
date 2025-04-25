import { Component, Input } from '@angular/core';
import { CalendarEvent } from '../../../models/calendar-event.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-user-event-card',
  imports: [CommonModule, MatCardModule, MatIconModule,],
  templateUrl: './user-event-card.component.html',
  styleUrl: './user-event-card.component.css'
})
export class UserEventCardComponent {
  @Input() event?: CalendarEvent;
}
