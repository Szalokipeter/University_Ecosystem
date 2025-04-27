import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { Todo } from '../../../models/todo.model';

@Component({
  selector: 'app-todo-form',
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDialogModule,
  ],
  templateUrl: './todo-form.component.html',
  styleUrl: './todo-form.component.css',
})
export class TodoFormComponent {
  dialogRef = inject(MatDialogRef<TodoFormComponent>);
  data = inject<{
    todo?: Todo;
    isEdit: boolean;
  }>(MAT_DIALOG_DATA);

  todo: Partial<Todo>;
  statusOptions = ['Todo', 'In-Progress', 'Done'];

  constructor() {
    this.todo = this.data.todo
      ? { ...this.data.todo }
      : {
          title: '',
          body: '',
          status: 'Todo',
        };
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.dialogRef.close(this.todo);
  }
}
