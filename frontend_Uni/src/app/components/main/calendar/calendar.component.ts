import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CalendarEvent } from '../../../models/calendar-event.model';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../services/auth.service';
import { EventDetailModalComponent } from '../../portal/event-detail-modal/event-detail-modal.component';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    MatIconModule,
    DatePipe,
    MatTooltipModule,
    NgIf,
    NgFor,
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
  providers: [DatePipe],
})
export class CalendarComponent implements OnChanges {
  @Input() eventsMap: Map<string, CalendarEvent[]> = new Map();
  @Input() loading = true;
  @Input() error: string | null = null;
  @Input() isInPortal = false;

  @Output() eventAction = new EventEmitter<{
    action: 'update' | 'delete';
    event: CalendarEvent;
    isPublic: boolean;
  }>();
  @Output() retry = new EventEmitter<void>();

  currentDate: Date = new Date();
  weeks: CalendarWeekDay[][] = [];

  constructor(
    private datePipe: DatePipe,
    private dialog: MatDialog,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    // Always regenerate calendar when eventsMap changes
    if (changes['eventsMap']) {
      // Create a new reference to force change detection
      this.eventsMap = new Map(changes['eventsMap'].currentValue);
      this.generateCalendar();
      this.cdr.detectChanges();
    }

    if (changes['loading'] || changes['error']) {
      this.cdr.detectChanges();
    }
  }
  private triggerViewUpdate() {
    this.generateCalendar();
    this.cdr.markForCheck();
  }

  trackByWeek(index: number, week: CalendarWeekDay[]): string {
    return week[0]?.date.toISOString();
  }
  trackByDay(index: number, day: CalendarWeekDay): string {
    return day.date.toISOString();
  }

  trackByEvent(index: number, event: CalendarEvent): string {
    return event.id.toString();
  }

  generateCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

    this.weeks = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const week: CalendarWeekDay[] = [];

      for (let i = 0; i < 7; i++) {
        const date = new Date(currentDate);
        const dayEvents = this.getEventsForDate(date);

        week.push({
          date,
          isCurrentMonth: date.getMonth() === month,
          events: dayEvents,
          isToday: this.isSameDate(date, new Date()),
        });

        currentDate.setDate(currentDate.getDate() + 1);
      }

      this.weeks.push(week);
    }
  }

  getEventsForDate(date: Date): CalendarEvent[] {
    const dateStr = this.datePipe.transform(date, 'yyyy-MM-dd') || '';
    return (this.eventsMap?.get(dateStr) || []).sort((a, b) =>
      a.title.localeCompare(b.title)
    );
  }

  isSameDate(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  changeMonth(offset: number) {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + offset,
      1
    );
    this.generateCalendar();
  }

  getEventColor(eventType: string): string {
    const colorMap: Record<string, string> = {
      'open to public': '#508484',
      'family affairs': '#9E7682',
      'student affairs': '#F7C4A5',
      'registration required': '#EDCB96',
    };

    const normalizedType = eventType.toLowerCase().trim();
    return colorMap[normalizedType] || '#9C27B0';
  }

  openEventDetails(event: CalendarEvent) {
    const canEditPublic = this.authService.isAdminOrTeacher();
    const canEdit =
      this.isInPortal && (canEditPublic || event.uni_user_id !== undefined);

    console.log('Can isInPortal: ', this.isInPortal);
    console.log('Can canEditPublic: ', canEditPublic);
    console.log('Can isEventPrivate:', event.uni_user_id !== undefined);
    console.log('Can canEdit: ', canEdit);
    const dialogRef = this.dialog.open(EventDetailModalComponent, {
      width: '500px',
      data: {
        event,
        isPublic: event.uni_user_id == null,
        canEdit: canEdit,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.eventAction.emit(result);
      }
    });
  }
}

interface CalendarWeekDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: CalendarEvent[];
}
