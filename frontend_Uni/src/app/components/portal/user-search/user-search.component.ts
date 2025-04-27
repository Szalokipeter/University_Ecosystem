import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { UserModel } from '../../../models/user.model';
import { MatIcon } from '@angular/material/icon';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-user-search',
  imports: [CommonModule, ReactiveFormsModule, MatIcon, MatSelectModule],
  templateUrl: './user-search.component.html',
  styleUrl: './user-search.component.css',
})
export class UserSearchComponent {
  @Input() allUsers: UserModel[] = [];
  @Output() filteredUsers = new EventEmitter<UserModel[]>();
  @Output() onAddNew = new EventEmitter<void>();

  searchForm: FormGroup;
  roleOptions = [
    { value: null, label: 'All Roles' },
    { value: 1, label: 'Admin' },
    { value: 2, label: 'Teacher' },
    { value: 3, label: 'Student' },
  ];

  constructor(private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      searchTerm: [''],
      roleFilter: [null],
      sortOption: ['username-asc'],
    });

    // Add debounce to search input
    this.searchForm.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => this.applyFilters());
  }

  applyFilters() {
    const searchTerm = this.searchForm
      .get('searchTerm')
      ?.value?.toLowerCase()
      .trim();
    const roleFilter = this.searchForm.get('roleFilter')?.value;
    const sortOption = this.searchForm.get('sortOption')?.value;

    let filtered = [...this.allUsers];

    // Apply search term filter
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.username.toLowerCase().includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm)
      );
    }

    // Apply role filter
    if (roleFilter) {
      filtered = filtered.filter((user) => user.roles_id === roleFilter);
    }

    // Apply sorting
    filtered = this.sortUsers(filtered, sortOption);

    this.filteredUsers.emit(filtered);
  }

  sortUsers(users: UserModel[], sortOption: string): UserModel[] {
    const [field, direction] = sortOption.split('-');

    return [...users].sort((a, b) => {
      const aValue = String(a[field as keyof UserModel] || '').toLowerCase();
      const bValue = String(b[field as keyof UserModel] || '').toLowerCase();

      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  clearFilters() {
    this.searchForm.reset({
      searchTerm: '',
      roleFilter: null,
      sortOption: 'username-asc',
    });
  }
}
