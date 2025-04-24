import { Component } from '@angular/core';
import { UserSearchComponent } from '../user-search/user-search.component';
import { AddUserPayload, UserModel } from '../../../models/user.model';
import { NgIf } from '@angular/common';
import { DataService } from '../../../services/data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserCardListComponent } from '../user-card-list/user-card-list.component';
import { UserCardComponent } from '../user-card/user-card.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { UserFormComponent } from '../user-form/user-form.component';

@Component({
  selector: 'app-user-control',
  imports: [
    UserSearchComponent,
    NgIf,
    UserCardListComponent,
    UserCardComponent,
    MatProgressSpinner,
  ],
  templateUrl: './user-control.component.html',
  styleUrl: './user-control.component.css',
})
export class UserControlComponent {
  allUsers: UserModel[] = [];
  filteredUsers: UserModel[] = [];
  selectedUser: UserModel | null = null;
  isLoading = true;
  message = '';
  messageType: 'success' | 'error' | '' = '';

  constructor(
    private dataService: DataService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;
    this.dataService.getAllUsers().subscribe({
      next: (users) => {
        this.allUsers = users.flat();
        this.filteredUsers = [...this.allUsers];
        this.isLoading = false;
      },
      error: (err) => {
        this.snackBar.open('Failed to load users', 'Close', { duration: 5000 });
        this.isLoading = false;
      },
    });
  }

  handleSearchResults(user: UserModel) {
    this.selectedUser = user;
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
        if ('user' in response && response.user) {
          this.selectedUser = response.user;
          this.showMessage('User added successfully', 'success');
        }
      },
      error: (err) => {
        const errorMsg = err.error?.message || 'Failed to add user';
        this.showMessage(errorMsg, 'error');
      },
    });
  }

  updateUserList(updatedUser: UserModel) {
    const index = this.allUsers.findIndex((u) => u.id === updatedUser.id);
    if (index >= 0) {
      this.allUsers[index] = updatedUser;
      this.filteredUsers = [...this.allUsers];
    }
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
