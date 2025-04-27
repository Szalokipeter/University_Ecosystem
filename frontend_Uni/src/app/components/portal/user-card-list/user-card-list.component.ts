import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { UserModel } from '../../../models/user.model';
import { UserCardComponent } from '../user-card/user-card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-card-list',
  imports: [
    MatPaginatorModule,
    UserCardComponent,
    CommonModule
  ],
  templateUrl: './user-card-list.component.html',
  styleUrl: './user-card-list.component.css',
})
export class UserCardListComponent {
  @Input() users: UserModel[] = [];
  @Output() userSelected = new EventEmitter<UserModel>();

  pageSize = 10;
  currentPage = 1;
  totalPages = 1;

  ngOnChanges() {
    this.calculateTotalPages();
  }

  calculateTotalPages() {
    this.totalPages = Math.ceil(this.users.length / this.pageSize);
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
  }

  notFirstPage(): boolean {
    return this.currentPage > 1;
  }

  notFinalPage(): boolean {
    return this.currentPage < this.totalPages;
  }

  invokePrevPage() {
    if (this.notFirstPage()) {
      this.currentPage--;
    }
  }

  invokeNextPage() {
    if (this.notFinalPage()) {
      this.currentPage++;
    }
  }

  getPaginatedUsers(): UserModel[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.users.slice(startIndex, startIndex + this.pageSize);
  }
}
