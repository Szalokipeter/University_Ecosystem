import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Todo } from '../../../models/todo.model';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-todo-card',
  imports: [MatIconModule, DatePipe, CommonModule],
  templateUrl: './todo-card.component.html',
  styleUrl: './todo-card.component.css',
  providers: [DatePipe],
})
export class TodoCardComponent {
  @Input() todo!: Todo;
  @Input() showActions = true;
  @Output() edit = new EventEmitter<Todo>();
  @Output() delete = new EventEmitter<number>();

  onEdit() {
    this.edit.emit(this.todo);
  }

  onDelete() {
    this.delete.emit(this.todo.id);
  }
}
