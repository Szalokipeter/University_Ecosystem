import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { EventCardComponent } from '../../main/event-card/event-card.component';
import { CommonModule, NgFor } from '@angular/common';
import Swiper from 'swiper';
import { CalendarEvent } from '../../../models/calendar-event.model';
import { DataService } from '../../../services/data.service';
import { CalendarComponent } from '../../main/calendar/calendar.component';
import {
  debounceTime,
  forkJoin,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../services/auth.service';
import { EventFormComponent } from '../event-form/event-form.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { UserEventListComponent } from '../user-event-list/user-event-list.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    EventCardComponent,
    CalendarComponent,
    FormsModule,
    MatIcon,
    CommonModule,
    MatProgressSpinner,
    UserEventListComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  events: CalendarEvent[] = [];
  personalEvents: CalendarEvent[] = [];
  publicEvents: CalendarEvent[] = [];
  filteredEvents: CalendarEvent[] = [];
  loading = true;
  error: string | null = null;

  // Filters
  durationFilter: string = '7days';
  publicityFilter: string = 'all';
  eventTypeFilter: string = 'all';
  searchQuery: string = '';
  eventTypes: string[] = [];

  calendarPublicityFilter: string = 'all';
  calendarEventTypeFilter: string = 'all';
  eventsByDate = new Map<string, CalendarEvent[]>();

  showSubscribedEvents = false;
  loadingSubscribedEvents = false;
  subscribedEvents: CalendarEvent[] = [];

  private swiper?: Swiper;
  private destroy$ = new Subject<void>();
  private loadRequest$ = new Subject<void>();
  public authService = inject(AuthService);

  constructor(
    private dataService: DataService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) {
    this.loadRequest$
      .pipe(
        debounceTime(300),
        tap(() => {
          this.loading = true;
          this.error = null;
        }),
        switchMap(() =>
          forkJoin([
            this.dataService.getPersonalEvents(),
            this.dataService.getPublicEvents(),
          ])
        ),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: ([personalEvents, publicEvents]) => {
          this.personalEvents = personalEvents;
          this.publicEvents = publicEvents;
          this.updateCombinedEvents();
          this.eventTypes = [
            ...new Set(this.events.map((event) => event.event_type)),
          ];
          this.updateEventsMap(this.events);
          this.applyFilters();
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error loading events:', err);
          this.error = 'Failed to load events';
          this.loading = false;
          this.cdr.detectChanges();
        },
      });
  }

  ngAfterViewInit() {
    this.initSwiper();
    this.loadEvents();
  }

  private updateCombinedEvents(): void {
    this.events = [...this.personalEvents, ...this.publicEvents].sort(
      (a, b) =>
        new Date(a.dateofevent).getTime() - new Date(b.dateofevent).getTime()
    );
  }

  private initSwiper(): void {
    try {
      this.swiper = new Swiper('.swiper', {
        loop: true,
        slidesPerView: 'auto',
        spaceBetween: 24,
        speed: 400,
        autoplay: false,
        slideToClickedSlide: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
          dynamicBullets: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        breakpoints: {
          0: { slidesPerView: 1 },
          1024: { slidesPerView: 2 },
        },
      });
    } catch (err) {
      console.error('Swiper initialization error:', err);
    }
  }

  loadEvents() {
    this.loading = true;
    this.error = null;
    this.loadRequest$.next();
  }

  applyFilters() {
    let eventsToFilter: CalendarEvent[];

    switch (this.publicityFilter) {
      case 'public':
        eventsToFilter = this.publicEvents;
        break;
      case 'personal':
        eventsToFilter = this.personalEvents;
        break;
      default:
        eventsToFilter = this.events;
    }

    const now = new Date();
    let filtered = eventsToFilter.filter((event) => {
      const eventDate = new Date(event.dateofevent);

      switch (this.durationFilter) {
        case 'today':
          return this.isSameDate(eventDate, now);
        case 'tomorrow':
          const tomorrow = new Date(now);
          tomorrow.setDate(tomorrow.getDate() + 1);
          return this.isSameDate(eventDate, tomorrow);
        case '7days':
          const nextWeek = new Date(now);
          nextWeek.setDate(nextWeek.getDate() + 7);
          return eventDate >= now && eventDate <= nextWeek;
        case 'month':
          const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          return eventDate >= now && eventDate <= endOfMonth;
        case '30days':
          const next30Days = new Date(now);
          next30Days.setDate(next30Days.getDate() + 30);
          return eventDate >= now && eventDate <= next30Days;
        case 'nextMonth':
          const nextMonthStart = new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            1
          );
          const nextMonthEnd = new Date(
            now.getFullYear(),
            now.getMonth() + 2,
            0
          );
          return eventDate >= nextMonthStart && eventDate <= nextMonthEnd;
        default:
          return eventDate >= now;
      }
    });

    if (this.eventTypeFilter !== 'all') {
      filtered = filtered.filter(
        (event) => event.event_type === this.eventTypeFilter
      );
    }

    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter((event) =>
        event.title.toLowerCase().includes(query)
      );
    }

    this.filteredEvents = filtered
      .sort(
        (a, b) =>
          new Date(a.dateofevent).getTime() - new Date(b.dateofevent).getTime()
      )
      .slice(0, 5);

    this.cdr.detectChanges();

    setTimeout(() => {
      if (this.swiper && typeof this.swiper.update === 'function') {
        this.swiper.update();
        this.swiper.slideTo(0);
      } else {
        this.initSwiper();
      }
    }, 0);
  }

  private isSameDate(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  updateCalendar() {
    let eventsToFilter: CalendarEvent[];

    switch (this.calendarPublicityFilter) {
      case 'public':
        eventsToFilter = this.publicEvents;
        break;
      case 'personal':
        eventsToFilter = this.personalEvents;
        break;
      default:
        eventsToFilter = this.events;
    }

    if (this.calendarEventTypeFilter !== 'all') {
      eventsToFilter = eventsToFilter.filter(
        (event) => event.event_type === this.calendarEventTypeFilter
      );
    }

    this.updateEventsMap(eventsToFilter);
  }

  private updateEventsMap(events: CalendarEvent[]): void {
    const newMap = new Map<string, CalendarEvent[]>();
    events.forEach((event) => {
      const dateStr = this.normalizeDate(event.dateofevent);
      if (!newMap.has(dateStr)) {
        newMap.set(dateStr, []);
      }
      newMap.get(dateStr)!.push(event);
    });
    this.eventsByDate = newMap;
    this.cdr.detectChanges();
  }

  private addToEventsMap(event: CalendarEvent): void {
    const dateStr = this.normalizeDate(event.dateofevent);
    const newMap = new Map(this.eventsByDate);

    if (!newMap.has(dateStr)) {
      newMap.set(dateStr, []);
    }
    newMap.get(dateStr)!.push(event);

    this.eventsByDate = newMap;
    this.cdr.detectChanges();
  }

  private removeFromEventsMap(event: CalendarEvent): void {
    const dateStr = this.normalizeDate(event.dateofevent);
    const newMap = new Map(this.eventsByDate);

    if (newMap.has(dateStr)) {
      const filteredEvents = newMap
        .get(dateStr)!
        .filter((e) => e.id !== event.id);
      if (filteredEvents.length > 0) {
        newMap.set(dateStr, filteredEvents);
      } else {
        newMap.delete(dateStr);
      }
    }

    this.eventsByDate = newMap;
    this.cdr.detectChanges();
  }

  private normalizeDate(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toISOString().split('T')[0];
  }

  private getTargetArray(isPublic: boolean): CalendarEvent[] {
    return isPublic ? this.publicEvents : this.personalEvents;
  }

  private updateEventInMap(
    oldEvent: CalendarEvent,
    newEvent: CalendarEvent
  ): void {
    if (oldEvent.dateofevent !== newEvent.dateofevent) {
      this.removeFromEventsMap(oldEvent);
    }
    this.addToEventsMap(newEvent);
  }

  addEvent(): void {
    const canEditPublic = this.authService.isAdminOrTeacher();
    const dialogRef = this.dialog.open(EventFormComponent, {
      width: '500px',
      data: { isEdit: false, isPublic: false, canEditPublic },
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        if (!result) return;

        this.dataService
          .createCalendarEvent(result.event, result.isPublic)
          .subscribe({
            next: (newEvent) => {
              const targetArray = this.getTargetArray(result.isPublic);
              targetArray.push(newEvent);
              this.updateCombinedEvents();
              this.addToEventsMap(newEvent);
              this.applyFilters();
              this.updateCalendar();
              this.cdr.detectChanges();
            },
            error: (err) => console.error('Error creating event:', err),
          });
      });
  }

  handleCalendarEventAction(actionData: {
    action: 'update' | 'delete';
    event: CalendarEvent;
    isPublic: boolean;
  }): void {
    switch (actionData.action) {
      case 'update':
        this.handleUpdateEvent(actionData.event, actionData.isPublic);
        break;
      case 'delete':
        this.handleDeleteEvent(actionData.event, actionData.isPublic);
        break;
      default:
        console.warn(`Unhandled calendar action: ${actionData.action}`);
    }

    if (actionData.isPublic && this.showSubscribedEvents) {
      const index = this.subscribedEvents.findIndex(
        (e) => e.id === actionData.event.id
      );
      if (index !== -1) {
        if (actionData.action === 'delete') {
          this.subscribedEvents.splice(index, 1);
        } else {
          this.subscribedEvents[index] = actionData.event;
        }
      }
    }
  }

  private handleUpdateEvent(event: CalendarEvent, isPublic: boolean): void {
    const dialogRef = this.dialog.open(EventFormComponent, {
      width: '500px',
      data: {
        event,
        isEdit: true,
        isPublic,
        canEditPublic: this.authService.isAdminOrTeacher(),
      },
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((updatedData) => {
        if (!updatedData) return;

        const updatedEvent = updatedData.event;
        const wasPublic = isPublic;
        const isNowPublic = updatedData.isPublic;

        if (wasPublic !== isNowPublic) {
          forkJoin([
            this.dataService.deleteCalendarEvent(event.id, wasPublic),
            this.dataService.createCalendarEvent(updatedEvent, isNowPublic),
          ]).subscribe({
            next: ([_, newEvent]) => {
              const oldArray = this.getTargetArray(wasPublic);
              const oldIndex = oldArray.findIndex((e) => e.id === event.id);
              if (oldIndex !== -1) oldArray.splice(oldIndex, 1);

              const newArray = this.getTargetArray(isNowPublic);
              newArray.push(newEvent);

              this.updateCombinedEvents();
              this.updateEventInMap(event, newEvent);
              this.applyFilters();
              this.updateCalendar();
              this.cdr.detectChanges();
            },
            error: (err) => console.error('Error moving event:', err),
          });
        } else {
          this.dataService
            .updateCalendarEvent(event.id, updatedEvent, isPublic)
            .subscribe({
              next: (updatedEvent) => {
                const targetArray = this.getTargetArray(isPublic);
                const index = targetArray.findIndex((e) => e.id === event.id);
                if (index !== -1) targetArray[index] = updatedEvent;

                this.updateCombinedEvents();
                this.updateEventInMap(event, updatedEvent);
                this.applyFilters();
                this.updateCalendar();
                this.cdr.detectChanges();
              },
              error: (err) => console.error('Error updating event:', err),
            });
        }
      });
  }

  private handleDeleteEvent(event: CalendarEvent, isPublic: boolean): void {
    this.dataService.deleteCalendarEvent(event.id, isPublic).subscribe({
      next: () => {
        const targetArray = this.getTargetArray(isPublic);
        const index = targetArray.findIndex((e) => e.id === event.id);
        if (index !== -1) targetArray.splice(index, 1);

        this.updateCombinedEvents();
        this.removeFromEventsMap(event);
        this.applyFilters();
        this.updateCalendar();
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error deleting event:', err),
    });
  }

  toggleSubscribedEvents(): void {
    this.showSubscribedEvents = !this.showSubscribedEvents;
    if (this.showSubscribedEvents && this.subscribedEvents.length === 0) {
      this.loadSubscribedEvents();
    }
  }

  loadSubscribedEvents(): void {
    this.loadingSubscribedEvents = true;
    this.dataService.getEventsWithSubscriptions().subscribe({
      next: (events) => {
        this.subscribedEvents = events.filter((event) => event.subscribed);
        this.loadingSubscribedEvents = false;
      },
      error: (err) => {
        console.error('Error loading subscribed events:', err);
        this.loadingSubscribedEvents = false;
      },
    });
  }

  onUnsubscribeEvent(eventId: number): void {
    this.dataService.signUpForEvent(eventId).subscribe({
      next: () => {
        // Remove from subscribed events
        this.subscribedEvents = this.subscribedEvents.filter(
          (e) => e.id !== eventId
        );

        // Also update the public events list if the event exists there
        const publicEvent = this.publicEvents.find((e) => e.id === eventId);
        if (publicEvent) {
          publicEvent.subscribed = false;
        }
      },
      error: (err) => {
        console.error('Error unsubscribing from event:', err);
      },
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();

    if (this.swiper && typeof this.swiper.destroy === 'function') {
      this.swiper.destroy(true, true);
    }
  }
}
