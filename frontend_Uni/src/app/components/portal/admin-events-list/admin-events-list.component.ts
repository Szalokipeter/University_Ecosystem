import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  computed,
} from '@angular/core';
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
  private _events: CalendarEvent[] = [];
  @Input() set events(value: CalendarEvent[]) {
    this._events = [...value].sort(
      (a, b) =>
        new Date(a.dateofevent).getTime() - new Date(b.dateofevent).getTime()
    );
    this.calculateTotalPages();
  }
  get events(): CalendarEvent[] {
    return this._events;
  }

  @Input() itemsPerPage = 5;
  currentPage = signal(1);
  totalPages = signal(1);
  @Output() pageChanged = new EventEmitter<number>();

  expandedEventId: number | null = null;

  // Computed property for paginated events
  paginatedEvents = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.events.slice(startIndex, endIndex);
  });

  toggleEventExpand(eventId: number) {
    this.expandedEventId = this.expandedEventId === eventId ? null : eventId;
  }

  calculateTotalPages() {
    this.totalPages.set(Math.ceil(this.events.length / this.itemsPerPage));
    // Reset to page 1 if current page exceeds new total pages
    if (this.currentPage() > this.totalPages()) {
      this.currentPage.set(1);
    }
  }

  goToPrevPage() {
    if (this.notFirstPage()) {
      this.currentPage.update((prev) => prev - 1);
      this.pageChanged.emit(this.currentPage());
    }
  }

  goToNextPage() {
    if (this.notFinalPage()) {
      this.currentPage.update((prev) => prev + 1);
      this.pageChanged.emit(this.currentPage());
    }
  }

  notFirstPage(): boolean {
    return this.currentPage() > 1;
  }

  notFinalPage(): boolean {
    return this.currentPage() < this.totalPages();
  }
}
