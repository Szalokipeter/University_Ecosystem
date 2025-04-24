import { Component, EventEmitter, Input, Output } from '@angular/core';
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
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-user-search',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIcon,
    MatProgressSpinnerModule,
  ],
  templateUrl: './user-search.component.html',
  styleUrl: './user-search.component.css',
})
export class UserSearchComponent {
  @Input() allUsers: UserModel[] = [];
  @Output() filteredUsers = new EventEmitter<UserModel[]>();
  @Output() onAddNew = new EventEmitter<void>();

  searchForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      searchTerm: [''],
    });

    // Add debounce to search input
    this.searchForm
      .get('searchTerm')
      ?.valueChanges.pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => this.applySearch());
  }

  applySearch() {
    const searchTerm = this.searchForm
      .get('searchTerm')
      ?.value?.toLowerCase()
      .trim();

    if (!searchTerm) {
      this.filteredUsers.emit([...this.allUsers]);
      return;
    }

    const filtered = this.allUsers.filter(
      (user) =>
        user.username.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)
    );

    this.filteredUsers.emit(filtered);
  }
}
