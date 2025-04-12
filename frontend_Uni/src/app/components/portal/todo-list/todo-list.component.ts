import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { TodoCardComponent } from '../todo-card/todo-card.component';
import { Todo } from '../../../models/todo.model';
import { DataService } from '../../../services/data.service';
import { MatDialog } from '@angular/material/dialog';
import { TodoFormComponent } from '../todo-form/todo-form.component';

@Component({
  selector: 'app-todo-list',
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    TodoCardComponent,
  ],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.css',
})
export class TodoListComponent implements OnInit {
  todos: Todo[] = [];
  filteredTodos: Todo[] = [];
  loading = true;
  error: string | null = null;

  // Filters
  statusFilter = 'all';
  searchQuery = '';
  sortBy = 'created_at';

  statusOptions: { value: string; label: string }[] = [];

  sortOptions = [
    { value: 'title', label: 'Title' },
    { value: 'created_at', label: 'Creation Date' },
    { value: 'updated_at', label: 'Last Updated' },
  ];

  constructor(private dataService: DataService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos(): void {
    this.loading = true;
    this.error = null;
    this.dataService.getPersonalTodos().subscribe({
      next: (todos) => {
        this.todos = todos;
        this.updateStatusOptions();
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading todos:', err);
        this.error = 'Failed to load todos';
        this.loading = false;
      },
    });
  }

  private updateStatusOptions(): void {
    const uniqueStatuses = [...new Set(this.todos.map(t => t.status))];
    
    const options = [{ value: 'all', label: 'All Statuses' }];
    
    uniqueStatuses.forEach(status => {
      options.push({
        value: status,
        label: this.formatStatusLabel(status)
      });
    });
    
    this.statusOptions = options;
  }

  private formatStatusLabel(status: string): string {
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  applyFilters(): void {
    let filtered = [...this.todos];

    // Apply status filter
    if (this.statusFilter !== 'all') {
      filtered = filtered.filter((todo) => todo.status === this.statusFilter);
    }

    // Apply search filter
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter((todo) =>
        todo.title.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (this.sortBy === 'title') {
        return a.title.localeCompare(b.title);
      } else {
        const dateA = new Date(a[this.sortBy as keyof Todo] as string);
        const dateB = new Date(b[this.sortBy as keyof Todo] as string);
        return dateB.getTime() - dateA.getTime(); // Newest first
      }
    });

    this.filteredTodos = filtered;
  }

  onDeleteTodo(id: number): void {
    if (confirm('Are you sure you want to delete this todo?')) {
      this.dataService.destroyTodo(id).subscribe({
        next: () => {
          this.todos = this.todos.filter((todo) => todo.id !== id);
          this.applyFilters();
        },
        error: (err) => {
          console.error('Error deleting todo:', err);
          alert('Failed to delete todo');
        },
      });
    }
  }

  onAddTodo(): void {
    const existingStatuses = [...new Set(this.todos.map((t) => t.status))];
    const dialogRef = this.dialog.open(TodoFormComponent, {
      width: '500px',
      data: { isEdit: false, existingStatuses }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dataService.createTodo(result).subscribe({
          next: (newTodo) => {
            this.todos.unshift(newTodo);
            this.applyFilters();
          },
          error: (err) => {
            console.error('Error creating todo:', err);
            alert('Failed to create todo');
          },
        });
      }
    });
  }

  onEditTodo(todo: Todo): void {
    const existingStatuses = [...new Set(this.todos.map((t) => t.status))];
    const dialogRef = this.dialog.open(TodoFormComponent, {
      width: '500px',
      data: { todo, isEdit: true, existingStatuses }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dataService.updateTodo(todo.id, result).subscribe({
          next: (updatedTodo) => {
            const index = this.todos.findIndex((t) => t.id === updatedTodo.id);
            if (index !== -1) {
              this.todos[index] = updatedTodo;
              this.applyFilters();
            }
          },
          error: (err) => {
            console.error('Error updating todo:', err);
            alert('Failed to update todo');
          },
        });
      }
    });
  }
}
