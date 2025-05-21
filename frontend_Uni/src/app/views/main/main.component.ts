import {
  ChangeDetectorRef,
  Component,
  HostListener,
  OnInit,
} from '@angular/core';
import { SlideCardListComponent } from '../../components/main/slide-card-list/slide-card-list.component';
import { NewsComponent } from '../../components/main/news/news.component';
import { CalendarComponent } from '../../components/main/calendar/calendar.component';
import { CalendarEvent } from '../../models/calendar-event.model';
import { DataService } from '../../services/data.service';
import { EventCardComponent } from '../../components/main/event-card/event-card.component';
import { CommonModule, DatePipe } from '@angular/common';
import { CourseCardListComponent } from '../../components/main/course-card-list/course-card-list.component';
import { HeaderComponent } from '../../components/main/header/header.component';

import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
import { SwiperOptions } from 'swiper/types';

@Component({
  selector: 'app-main',
  imports: [
    HeaderComponent,
    SlideCardListComponent,
    NewsComponent,
    CalendarComponent,
    EventCardComponent,
    CommonModule,
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

  swiperView = false;
  private swiperInstance: Swiper | null = null;

  constructor(
    private dataService: DataService,
    private cdr: ChangeDetectorRef,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.loadPublicEvents();
    this.loadUpcomingEvents();
    this.checkViewport();
  }

  ngAfterViewInit() {
    this.initSwiper();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkViewport();
  }

  private checkViewport() {
    const newView = window.innerWidth < 1200;
    if (newView !== this.swiperView) {
      this.swiperView = newView;
      this.cdr.detectChanges();

      if (this.swiperView) {
        this.initSwiper();
      } else {
        this.destroySwiper();
      }
    }
  }

  private initSwiper() {
    if (!this.swiperView || !this.upcomingEvents?.length) return;

    this.destroySwiper();

    setTimeout(() => {
      try {
        this.swiperInstance = new Swiper('.swiper', {
          modules: [Navigation],
          loop: false,
          centeredSlides: true,
          slidesPerView: 'auto',
          spaceBetween: 30,
          speed: 400,
          slideToClickedSlide: true,
          initialSlide: 1,
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
          breakpoints: {
            0: { slidesPerView: 1 },
            768: { slidesPerView: 1.2 },
            1024: { slidesPerView: 2.2 },
          },
        } as SwiperOptions);
      } catch (e) {
        console.error('Swiper initialization error:', e);
      }
    }, 100);
  }

  private destroySwiper() {
    if (
      this.swiperInstance &&
      typeof this.swiperInstance.destroy === 'function'
    ) {
      try {
        this.swiperInstance.destroy(true, true);
      } catch (e) {
        console.error('Swiper destruction error:', e);
      }
      this.swiperInstance = null;
    }
  }

  loadPublicEvents() {
    this.loading = true;
    this.error = null;
    this.dataService.getPublicEvents().subscribe({
      next: (events) => {
        this.updateEventsMap(events);
        this.loading = false;
        this.cdr.detectChanges();
        this.initSwiper();
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

  ngOnDestroy() {
    this.destroySwiper();
  }
}
