import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CalendarEvent } from '../../../models/calendar-event.model';
import { UserModel } from '../../../models/user.model';
import { DataService } from '../../../services/data.service';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { UserEventCardComponent } from '../user-event-card/user-event-card.component';

@Component({
  selector: 'app-admin-event-card',
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    UserEventCardComponent,
  ],
  templateUrl: './admin-event-card.component.html',
  styleUrl: './admin-event-card.component.css',
})
export class AdminEventCardComponent {
  @Input() event!: CalendarEvent;
  @Input() isExpanded = false;
  @Output() toggleExpand = new EventEmitter<void>();

  subscribers: UserModel[] = [];
  isLoadingSubscribers = false;
  errorLoadingSubscribers = false;

  constructor(private dataService: DataService) {}

  onCardClick() {
    this.toggleExpand.emit();
    if (!this.isExpanded && this.subscribers.length === 0) {
      console.log('Loading subscribers for event:', this.event.id);
      this.loadSubscribers();
    }
  }

  loadSubscribers() {
    this.isLoadingSubscribers = true;
    this.errorLoadingSubscribers = false;
    this.dataService.getEventSubscribers(this.event.id).subscribe({
      next: (users) => {
        this.subscribers = users;
        console.log('Loaded subscribers:', this.subscribers, 'list length:', this.subscribers.length);
        this.isLoadingSubscribers = false;
      },
      error: () => {
        this.errorLoadingSubscribers = true;
        this.isLoadingSubscribers = false;
      },
    });
  }
}
