import { Component } from '@angular/core';
import { UserSearchComponent } from '../user-search/user-search.component';
import { UserDetailsComponent } from '../user-details/user-details.component';
import { AddUserPayload, EditUserPayload, UserModel } from '../../../models/user.model';
import { NgIf } from '@angular/common';
import { DataService } from '../../../services/data.service';
import { UserFormComponent } from '../user-form/user-form.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-control',
  imports: [UserSearchComponent, UserDetailsComponent, NgIf],
  templateUrl: './user-control.component.html',
  styleUrl: './user-control.component.css',
})
export class UserControlComponent {
  user?: UserModel;
  message = '';
  messageType: 'success' | 'error' | '' = '';

  constructor(
    private dataService: DataService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  handleSearchResults(user: UserModel) {
    this.user = user;
    this.clearMessage();
  }

  handleAddNew() {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '500px',
      data: {}, // Empty data for add mode
    });

    dialogRef.afterClosed().subscribe((result: AddUserPayload) => {
      if (result) {
        this.addUser(result);
      }
    });
  }

  private addUser(payload: AddUserPayload) {
    this.dataService.addUser(payload).subscribe({
      next: (response) => {
        if ('user' in response) {
          this.user = response.user;
          this.showMessage('User added successfully', 'success');
        }
      },
      error: (err) => {
        const errorMsg = err.error?.message || 'Failed to add user';
        this.showMessage(errorMsg, 'error');
      },
    });
  }

  private showMessage(text: string, type: 'success' | 'error') {
    this.message = text;
    this.messageType = type;
    setTimeout(() => this.clearMessage(), 5000);
  }

  private clearMessage() {
    this.message = '';
    this.messageType = '';
  }
}
