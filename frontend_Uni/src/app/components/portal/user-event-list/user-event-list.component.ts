import { Component, Input, OnInit } from '@angular/core';
import { CalendarEvent } from '../../../models/calendar-event.model';
import { DataService } from '../../../services/data.service';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserEventCardComponent } from '../user-event-card/user-event-card.component';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-user-event-list',
  imports: [CommonModule, MatProgressSpinnerModule, UserEventCardComponent, MatIcon],
  templateUrl: './user-event-list.component.html',
  styleUrl: './user-event-list.component.css',
})
export class UserEventListComponent {
  @Input() userId?: number;
  events: CalendarEvent[] = [];
  isLoading = true;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    if (this.userId) {
      this.loadEvents();
    }
  }

  loadEvents() {
    this.isLoading = true;
    this.dataService.getPersonalEventsForUser(this.userId!).subscribe({
      next: (events) => {
        this.events = events;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load events:', err);
        this.isLoading = false;
      },
    });
  }
}
