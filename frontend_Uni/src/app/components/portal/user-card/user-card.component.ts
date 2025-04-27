import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { EditUserPayload, UserModel } from '../../../models/user.model';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe, NgIf } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { UserFormComponent } from '../user-form/user-form.component';
import { DataService } from '../../../services/data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, DatePipe, NgIf],
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.css'],
})
export class UserCardComponent {
  @Input() user?: UserModel;
  @Output() onEdit = new EventEmitter<EditUserPayload>();
  @Output() onDetails = new EventEmitter<UserModel>();

  isEditing = false;
  private dialog = inject(MatDialog);
  private dataService = inject(DataService);
  private snackBar = inject(MatSnackBar);

  openEditDialog() {
    if (!this.user) return;

    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '500px',
      data: { user: this.user }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateUser(result)
      }
    });
  }

  private updateUser(payload: EditUserPayload) {
    if (!this.user?.id) return;

    this.dataService.editUser(this.user.id, payload).subscribe({
      next: (response) => {
        if ('user' in response) {
          this.user = response.user;
          this.showSnackbar('User updated successfully', 'success');
        }
      },
      error: (err) => {
        const errorMsg = err.error?.message || 'Failed to update user';
        this.showSnackbar(errorMsg, 'error');
      }
    });
  }

  private showSnackbar(message: string, type: 'success' | 'error') {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: type === 'success' ? 'success-snackbar' : 'error-snackbar',
    });
  }

  getRoleName(roleId: number): string {
    switch (roleId) {
      case 1:
        return 'Administrator';
      case 2:
        return 'Teacher';
      default:
        return 'Student';
    }
  }

  isAdmin(): boolean {
    return this.user?.roles_id === 1;
  }

  showDetails() {
    if (this.user) {
      this.onDetails.emit(this.user);
    }
  }
}
