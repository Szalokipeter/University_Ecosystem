import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DataService } from '../../../services/data.service';
import { UserModel } from '../../../models/user.model';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-user-search',
  imports: [CommonModule, ReactiveFormsModule, MatIcon, MatProgressSpinnerModule],
  templateUrl: './user-search.component.html',
  styleUrl: './user-search.component.css',
})
export class UserSearchComponent {
  @Output() searchResults = new EventEmitter<UserModel>();
  @Output() onAddNew = new EventEmitter<void>();

  searchForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  loggedInUser: UserModel = JSON.parse(localStorage.getItem('loggedInUser') || '');

  constructor(private fb: FormBuilder, private dataService: DataService) {
    this.searchForm = this.fb.group({
      searchTerm: ['', Validators.required],      
    });
  }

  onSearch() {
    if (this.searchForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    const authToken = this.searchForm.get('searchTerm')?.value.trim();

    this.dataService.searchUser(authToken).subscribe({
      next: (user) => {
        console.log('Search results:', user);
        this.isLoading = false;
        this.searchResults.emit(user);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage =
          err.message || 'Failed to search users. Please try again.';
        console.error('Search error:', err);
      },
    });
  }
}
