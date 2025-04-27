import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  @Input() userId?: number; // For personal events
  @Input() events?: CalendarEvent[]; // For subscribed events (passed directly)
  @Input() isLoading = false;
  @Input() showUnsubscribe = false; // Only true in dashboard
  @Output() unsubscribe = new EventEmitter<number>();

  constructor(private dataService: DataService) {}

  ngOnInit() {
    // Only load events if userId is provided (personal events case)
    if (this.userId && !this.events) {
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

  onUnsubscribe(eventId: number) {
    this.unsubscribe.emit(eventId);
  }
}
