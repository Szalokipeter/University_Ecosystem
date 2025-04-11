import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CalendarEvent } from '../../../models/calendar-event.model';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { CommonModule, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-event-detail-modal',
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    DatePipe
  ],
  templateUrl: './event-detail-modal.component.html',
  styleUrl: './event-detail-modal.component.css',
  providers: [DatePipe],
})
export class EventDetailModalComponent {
  @Output() closed = new EventEmitter<void>();
  event: CalendarEvent;
  
  private data = inject(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<EventDetailModalComponent>);

  constructor() {
    this.event = this.data.event;
  }

  closeModal() {
    this.dialogRef.close();
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
}
