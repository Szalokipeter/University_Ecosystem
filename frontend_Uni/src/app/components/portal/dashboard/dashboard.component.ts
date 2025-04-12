import { ChangeDetectorRef, Component } from '@angular/core';
import { EventCardComponent } from '../../main/event-card/event-card.component';
import { NgFor } from '@angular/common';
import Swiper from 'swiper';
import { CalendarEvent } from '../../../models/calendar-event.model';
import { DataService } from '../../../services/data.service';
import { CalendarComponent } from '../../main/calendar/calendar.component';
import { forkJoin } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  imports: [EventCardComponent, NgFor, CalendarComponent, FormsModule],
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
  filteredCalendarEvents: CalendarEvent[] = [];

  private swiper?: Swiper;

  constructor(
    private dataService: DataService,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit() {
    this.initSwiper();
    this.loadEvents();
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

    forkJoin([
      this.dataService.getPersonalEvents(),
      this.dataService.getPublicEvents(),
    ]).subscribe({
      next: ([personalEvents, publicEvents]) => {
        this.personalEvents = personalEvents;
        this.publicEvents = publicEvents;
        this.events = [...personalEvents, ...publicEvents];
        this.eventTypes = [
          ...new Set(this.events.map((event) => event.event_type)),
        ];
        this.applyFilters();
        this.updateCalendar(); // Initialize calendar filters
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading events:', err);
        this.error = 'Failed to load events';
        this.loading = false;
      },
    });
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

  updateCalendar() {
    let eventsToFilter: CalendarEvent[];

    // Apply publicity filter
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

    // Apply event type filter
    if (this.calendarEventTypeFilter !== 'all') {
      eventsToFilter = eventsToFilter.filter(
        (event) => event.event_type === this.calendarEventTypeFilter
      );
    }

    this.filteredCalendarEvents = [...eventsToFilter];
  }

  private isSameDate(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  ngOnDestroy() {
    if (this.swiper && typeof this.swiper.destroy === 'function') {
      this.swiper.destroy(true, true);
    }
  }
}
