import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CalendarEvent } from '../../../models/calendar-event.model';
import { CommonModule } from '@angular/common';
import { AdminEventCardComponent } from '../admin-event-card/admin-event-card.component';

@Component({
  selector: 'app-admin-events-list',
  imports: [CommonModule, AdminEventCardComponent],
  templateUrl: './admin-events-list.component.html',
  styleUrl: './admin-events-list.component.css',
})
export class AdminEventsListComponent {
  @Input() events: CalendarEvent[] = [];
  @Input() currentPage = 1;
  @Input() totalPages = 1;
  @Output() pageChanged = new EventEmitter<number>();
  @Output() eventUpdated = new EventEmitter<CalendarEvent>();

  expandedEventId: number | null = null;

  toggleEventExpand(eventId: number) {
    this.expandedEventId = this.expandedEventId === eventId ? null : eventId;
  }

  notFirstPage(): boolean {
    return this.currentPage > 1;
  }

  notFinalPage(): boolean {
    return this.currentPage < this.totalPages;
  }

  goToPrevPage() {
    if (this.notFirstPage()) {
      this.pageChanged.emit(this.currentPage - 1);
    }
  }

  goToNextPage() {
    if (this.notFinalPage()) {
      this.pageChanged.emit(this.currentPage + 1);
    }
  }
}
