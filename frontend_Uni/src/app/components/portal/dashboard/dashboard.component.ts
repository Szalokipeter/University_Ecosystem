import { Component } from '@angular/core';
import { EventCardComponent } from '../../main/event-card/event-card.component';
import { NgFor } from '@angular/common';
import Swiper from 'swiper';
import { CalendarEvent } from '../../../models/calendar-event.model';
import { DataService } from '../../../services/data.service';
import { CalendarComponent } from '../../main/calendar/calendar.component';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  imports: [EventCardComponent, NgFor, CalendarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  events: CalendarEvent[] = [];
  loading = true;
  error: string | null = null;
  upcomingEvents: CalendarEvent[] = [];

  constructor(private dataService: DataService) {}

  ngAfterViewInit() {
    new Swiper('.swiper', {
      loop: true,
      slidesPerView: 'auto',
      spaceBetween: 24,
      speed: 400,
      autoplay: false,
      slideToClickedSlide: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        0: {
          slidesPerView: 1, // Mobile - less peeking
          centeredSlidesBounds: true,
        },
        1024: {
          slidesPerView: 2, // Desktop - even more peeking
        },
      },
    });
    this.loadEvents();
  }

  loadEvents() {
    this.loading = true;
    this.error = null;

    // Use forkJoin to combine both observables
    forkJoin([
      this.dataService.getPersonalEvents(),
      this.dataService.getPublicEvents(),
    ]).subscribe({
      next: ([personalEvents, publicEvents]) => {
        // Combine both event arrays
        const allEvents = [...personalEvents, ...publicEvents];

        // Filter and sort upcoming events
        const now = new Date();
        this.upcomingEvents = allEvents
          .filter((event) => new Date(event.dateofevent) >= now)
          .sort(
            (a, b) =>
              new Date(a.dateofevent).getTime() -
              new Date(b.dateofevent).getTime()
          )
          .slice(0, 5); // Get top 5 upcoming events

        // Set the combined events for the calendar
        this.events = allEvents;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading events:', err);
        this.error = 'Failed to load events';
        this.loading = false;
      },
    });
  }
}
