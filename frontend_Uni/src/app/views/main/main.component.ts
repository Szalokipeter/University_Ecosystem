import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SlideCardListComponent } from '../../components/main/slide-card-list/slide-card-list.component';
import { NewsComponent } from '../../components/main/news/news.component';
import { CalendarComponent } from '../../components/main/calendar/calendar.component';
import { CalendarEvent } from '../../models/calendar-event.model';
import { DataService } from '../../services/data.service';
import { EventCardComponent } from '../../components/main/event-card/event-card.component';
import { DatePipe, NgFor } from '@angular/common';
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
  providers: [DatePipe],
})
export class MainComponent implements OnInit {
  publicEventsMap = new Map<string, CalendarEvent[]>();
  loading = true;
  error: string | null = null;
  upcomingEvents: CalendarEvent[] = [];

  constructor(
    private dataService: DataService,
    private cdr: ChangeDetectorRef,
    private datePipe: DatePipe
  ) {}

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
  private updateEventsMap(events: CalendarEvent[]): void {
    const newMap = new Map<string, CalendarEvent[]>();

    events.forEach((event) => {
      const dateStr = this.normalizeDate(event.dateofevent);
      if (!newMap.has(dateStr)) {
        newMap.set(dateStr, []);
      }
      newMap.get(dateStr)!.push(event);
    });

    this.publicEventsMap = new Map(newMap);
    this.cdr.detectChanges();
  }

  private normalizeDate(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return this.datePipe.transform(dateObj, 'yyyy-MM-dd') || '';
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
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading upcoming events:', err);
      },
    });
  }
}
