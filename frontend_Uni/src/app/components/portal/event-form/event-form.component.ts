import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { CalendarEvent } from '../../../models/calendar-event.model';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-event-form',
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDialogModule,
  ],
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.css',
})
export class EventFormComponent {
  dialogRef = inject(MatDialogRef<EventFormComponent>);
  data = inject<{
    event?: CalendarEvent;
    isEdit: boolean;
    isPublic: boolean;
    canEditPublic: boolean;
  }>(MAT_DIALOG_DATA);
  authService = inject(AuthService);

  event: Partial<CalendarEvent>;
  eventTypes = [
    'Open to Public',
    'Family Affairs',
    'Student Affairs',
    'Registration Required',
  ];

  constructor() {
    this.event = this.data.event
      ? { ...this.data.event }
      : {
          title: '',
          body: '',
          event_type: 'Student Affairs',
          dateofevent: new Date().toISOString().split('T')[0],
        };
  }

  onSubmit(): void {
    this.dialogRef.close(this.event);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
