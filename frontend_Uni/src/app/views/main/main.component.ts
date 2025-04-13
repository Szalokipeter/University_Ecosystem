import { Component,OnInit } from '@angular/core';
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
  imports: [
    HeaderComponent,
    SlideCardListComponent,
    NewsComponent,
    CalendarComponent,
    EventCardComponent,
    NgFor,
    CourseCardListComponent,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent implements OnInit {
  publicEventsMap = new Map<string, CalendarEvent[]>();
  loading = true;
  error: string | null = null;
  upcomingEvents: CalendarEvent[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadPublicEvents();
    this.loadUpcomingEvents();
  }

  loadPublicEvents() {
    this.loading = true;
    this.error = null;

    this.dataService.getPublicEvents().subscribe({
      next: (events) => {
        this.updateEventsMap(events);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading events:', err);
        this.error = 'Failed to load events';
        this.loading = false;
      },
    });
  }
  private updateEventsMap(events: CalendarEvent[]): void {
    this.publicEventsMap.clear();
    events.forEach((event) => {
      const dateStr = new Date(event.dateofevent).toISOString().split('T')[0];
      if (!this.publicEventsMap.has(dateStr)) {
        this.publicEventsMap.set(dateStr, []);
      }
      this.publicEventsMap.get(dateStr)!.push(event);
    });
  }

  loadUpcomingEvents() {
    this.dataService.getPublicEvents().subscribe({
      next: (events) => {
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
