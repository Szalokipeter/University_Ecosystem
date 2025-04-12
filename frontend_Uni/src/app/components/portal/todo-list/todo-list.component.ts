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

  statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
  ];

  sortOptions = [
    { value: 'title', label: 'Title' },
    { value: 'created_at', label: 'Creation Date' },
    { value: 'updated_at', label: 'Last Updated' },
  ];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos(): void {
    this.loading = true;
    this.error = null;
    this.dataService.getPersonalTodos().subscribe({
      next: (todos) => {
        this.todos = todos;
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
    // todo: Implement the logic with dialoge to add a new todo
    console.log('Add new todo');
  }
  onEditTodo(todo: Todo): void {
    // todo: Implement the logic with dialoge to edit existing todo
    console.log('Edit todo:', todo);
  }
}
