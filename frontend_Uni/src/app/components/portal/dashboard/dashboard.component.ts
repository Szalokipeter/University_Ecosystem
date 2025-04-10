import { Component } from '@angular/core';
import { EventCardComponent } from '../../main/event-card/event-card.component';
import { NgFor } from '@angular/common';
import Swiper from 'swiper';
import { CalendarEvent } from '../../../models/calendar-event.model';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-dashboard',
  imports: [EventCardComponent, NgFor],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
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
        768: {
          slidesPerView: 2, // Tablet - more peeking
        },
        1024: {
          slidesPerView: 3, // Desktop - even more peeking
        },
      },
    });
    this.loadEvents();
  }

  loadEvents() {
    this.dataService.getPersonalEvents().subscribe({
      next: (events) => {
        const now = new Date();
        this.upcomingEvents = events
          .filter((event) => new Date(event.dateofevent) >= now)
          .sort(
            (a, b) =>
              new Date(a.dateofevent).getTime() -
              new Date(b.dateofevent).getTime()
          )
          .slice(0, 5);
      },
      error: (err) => {
        console.error('Error loading events:', err);
      },
    });
  }
}
