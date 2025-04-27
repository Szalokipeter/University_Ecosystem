import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { CalendarEvent } from '../../../models/calendar-event.model';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { DataService } from '../../../services/data.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-event-detail-modal',
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    DatePipe,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './event-detail-modal.component.html',
  styleUrl: './event-detail-modal.component.css',
  providers: [DatePipe],
})
export class EventDetailModalComponent implements OnInit {
  @Output() closed = new EventEmitter<void>();
  @Output() subscriptionChange = new EventEmitter<{
    eventId: number;
    isSubscribed: boolean;
  }>();

  event: CalendarEvent;
  isSignupLoading = false;
  isSignedUp: boolean | null = null;

  dialogRef = inject(MatDialogRef<EventDetailModalComponent>);
  data = inject<{
    event: CalendarEvent;
    isPublic: boolean;
    canEdit: boolean;
    isInPortal: boolean;
  }>(MAT_DIALOG_DATA);

  constructor(private dataService: DataService) {
    this.event = this.data.event;
  }

  ngOnInit(): void {
    this.checkSignupStatus();
  }

  get canEdit(): boolean {
    return this.data.canEdit;
  }
  get isPublic(): boolean {
    return this.data.isPublic;
  }
  get isInPortal(): boolean {
    return this.data.isInPortal;
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

  private checkSignupStatus(): void {
    this.isSignupLoading = true;
    this.dataService
      .checkEventSignup(this.event.id)
      .pipe(finalize(() => (this.isSignupLoading = false)))
      .subscribe({
        next: (response) => {
          this.isSignedUp = response.SubStatus;
          console.log('Signup status:', response);
        },
        error: (err) => {
          console.error('Error checking signup status:', err);
          this.isSignedUp = false;
        },
      });
  }

  onSignup(): void {
    if (!this.isPublic) return;

    this.isSignupLoading = true;
    this.dataService
      .signUpForEvent(this.event.id)
      .pipe(finalize(() => (this.isSignupLoading = false)))
      .subscribe({
        next: (response) => {
          this.checkSignupStatus();
          this.subscriptionChange.emit({
            eventId: this.event.id,
            isSubscribed: !this.isSignedUp,
          });
        },
        error: (err) => {
          console.error('Error signing up for event:', err);
        },
      });
  }

  getSignupTooltip(): string {
    if (this.isSignedUp === null) return '';
    return this.isSignedUp ? 'Click to unsubscribe' : 'Click to sign up';
  }

  getSignupIcon(): string {
    return this.isSignedUp ? 'event_busy' : 'event_available';
  }
}
