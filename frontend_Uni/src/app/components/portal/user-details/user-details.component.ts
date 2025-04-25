import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { UserModel } from '../../../models/user.model';
import { UserCardComponent } from '../user-card/user-card.component';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { UserEventListComponent } from '../user-event-list/user-event-list.component';
import { Todo } from '../../../models/todo.model';
import { DataService } from '../../../services/data.service';
import { TodoCardComponent } from '../todo-card/todo-card.component';

@Component({
  selector: 'app-user-details',
  imports: [
    UserCardComponent,
    CommonModule,
    MatIcon,
    UserEventListComponent,
    TodoCardComponent,
  ],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css',
})
export class UserDetailsComponent {
  @Input() user?: UserModel;
  @Output() backToList = new EventEmitter<UserModel>();

  userTodos: Todo[] = [];
  loadingTodos = false;
  todoError: string | null = null;

  constructor(private dataService: DataService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user'] && this.user) {
      this.loadUserTodos();
    }
  }

  loadUserTodos(): void {
    if (!this.user) return;
    
    this.loadingTodos = true;
    this.todoError = null;
    
    if (this.user.id !== undefined) {
      this.dataService.getPersonalTodosForUser(this.user.id).subscribe({
        next: (todos) => {
          this.userTodos = todos;
          this.loadingTodos = false;
        },
        error: (err: any) => {
          console.error('Error loading user todos:', err);
          this.todoError = 'Failed to load user todos';
          this.loadingTodos = false;
        }
      });
    }
  }
}
