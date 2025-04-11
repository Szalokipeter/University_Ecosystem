import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EventDetailModalComponent } from '../components/portal/event-detail-modal/event-detail-modal.component';
import { CalendarEvent } from '../models/calendar-event.model';

@Injectable({
  providedIn: 'root'
})
export class EventModalService {
  constructor(private dialog: MatDialog) {}

  openEventModal(event: CalendarEvent) {
    this.dialog.open(EventDetailModalComponent, {
      data: { event },
      panelClass: 'custom-modal',
      width: '600px',
      maxWidth: '100vw',
      maxHeight: '100vh',
      disableClose: false,
      autoFocus: false,
    });
  }
}