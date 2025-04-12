import { Component, OnInit } from '@angular/core';
import { SlideCardListComponent } from '../../components/main/slide-card-list/slide-card-list.component';
import { NewsComponent } from '../../components/main/news/news.component';
import { CalendarComponent } from '../../components/main/calendar/calendar.component';
import { CalendarEvent } from '../../models/calendar-event.model';
import { DataService } from '../../services/data.service';
import { EventCardComponent } from '../../components/main/event-card/event-card.component';
import { NgFor } from '@angular/common';
import { CourseCardListComponent } from '../../components/main/course-card-list/course-card-list.component';
import { HeaderComponent } from '../../components/main/header/header.component';

@Component({
  selector: 'app-main',
  imports: [HeaderComponent, SlideCardListComponent, NewsComponent, CalendarComponent, EventCardComponent, NgFor, CourseCardListComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent implements OnInit {
  publicEvents: CalendarEvent[] = [];
  loading = true;
  error: string | null = null;
  upcomingEvents: CalendarEvent[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadEvents();
    this.loadUpcomingEvents();
  }

  loadEvents() {
    this.loading = true;
    this.error = null;
    
    this.dataService.getPublicEvents().subscribe({
      next: (events) => {
        this.publicEvents = events;        
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading events:', err);
        this.error = 'Failed to load events';
        this.loading = false;
      }
    });
  }

  loadUpcomingEvents() {
    this.dataService.getPublicEvents().subscribe({
      next: (events) => {
        // Filter future events and sort by date
        const now = new Date();
        this.upcomingEvents = events
          .filter((event) => new Date(event.dateofevent) >= now)
          .sort(
            (a, b) =>
              new Date(a.dateofevent).getTime() -
              new Date(b.dateofevent).getTime()
          )
          .slice(0, 3);
      },
      error: (err) => {
        console.error('Error loading upcoming events:', err);
      },
    });
  }
}
