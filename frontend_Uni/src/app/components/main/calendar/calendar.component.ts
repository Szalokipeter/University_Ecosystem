import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CalendarEvent } from '../../../models/calendar-event.model';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EventModalService } from '../../../services/event-modal.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../services/auth.service';
import { EventFormComponent } from '../../portal/event-form/event-form.component';
import { EventDetailModalComponent } from '../../portal/event-detail-modal/event-detail-modal.component';
import { DataService } from '../../../services/data.service';

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
  @Input() events: CalendarEvent[] = [];
  @Input() loading = true;
  @Input() error: string | null = null;
  @Input() isInPortal = false;
  @Output() eventAction = new EventEmitter<{
    action: 'update' | 'delete';
    event: CalendarEvent;
    isPublic: boolean;
  }>();
  currentDate: Date = new Date();
  weeks: CalendarWeekDay[][] = [];

  constructor(
    private datePipe: DatePipe,
    private eventModal: EventModalService,
    private dialog: MatDialog,
    private authService: AuthService,
    private dataService: DataService
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    this.generateCalendar();
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
    return this.events
      .filter((event: CalendarEvent) => event.dateofevent.startsWith(dateStr))
      .sort((a: CalendarEvent, b: CalendarEvent) =>
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
      'open to public': '#508484', // Green
      'family affairs': '#9E7682', // Blue
      'student affairs': '#F7C4A5', // Amber
      'registration required': '#EDCB96', // Red
    };

    const normalizedType = eventType.toLowerCase().trim();

    return colorMap[normalizedType] || '#9C27B0';
  }

  openEventDetails(event: CalendarEvent) {
    const canEditPublic = this.authService.isAdminOrTeacher();
    const canEdit = this.isInPortal && (canEditPublic || event.uni_user_id !== null); //returns true only this.isInPortal = true and either in () is true
    const dialogRef = this.dialog.open(EventDetailModalComponent, {
      width: '500px',
      data: {
        event: event,
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
