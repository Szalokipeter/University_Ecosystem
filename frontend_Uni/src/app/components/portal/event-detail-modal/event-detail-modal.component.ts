import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CalendarEvent } from '../../../models/calendar-event.model';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { CommonModule, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-event-detail-modal',
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    DatePipe,
  ],
  templateUrl: './event-detail-modal.component.html',
  styleUrl: './event-detail-modal.component.css',
  providers: [DatePipe],
})
export class EventDetailModalComponent {
  @Output() closed = new EventEmitter<void>();
  event: CalendarEvent;

  dialogRef = inject(MatDialogRef<EventDetailModalComponent>);
  data = inject<{
    event: CalendarEvent;
    isPublic: boolean;
    isInPortal: boolean;
  }>(MAT_DIALOG_DATA);
  authService = inject(AuthService);

  constructor() {
    this.event = this.data.event;
  }

  get canEdit(): boolean {
    if (!this.data.isInPortal) return false;
    if (!this.data.isPublic) return true;
    return (
      this.authService.loggedInUser?.roles_id === 1 ||
      this.authService.loggedInUser?.roles_id === 2
    );
  }

  onUpdate(): void {
    this.dialogRef.close({
      action: 'update',
      event: this.data.event,
      isPublic: this.data.isPublic,
    });
  }

  onDelete(): void {
    if (confirm('Are you sure you want to delete this event?')) {
      this.dialogRef.close({
        action: 'delete',
        event: this.data.event,
        isPublic: this.data.isPublic,
      });
    }
  }

  closeModal(): void {
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
