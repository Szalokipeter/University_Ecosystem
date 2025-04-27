import { Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { News, NewsFormAction } from '../../../models/news.model';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-news-form',
  templateUrl: './news-form.component.html',
  styleUrls: ['./news-form.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
})
export class NewsFormComponent {
  newsForm!: FormGroup;
  mode: 'add' | 'edit' = 'add';

  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<NewsFormComponent>);
  private data = inject<{ mode: 'add' | 'edit'; news?: News }>(MAT_DIALOG_DATA);

  constructor() {
    this.initializeForm();

    this.mode = this.data.mode;

    if (this.mode === 'edit' && this.data.news) {
      this.populateForm(this.data.news);
    }
  }

  private initializeForm() {
    this.newsForm = this.fb.group({
      title: ['', Validators.required],
      body: ['', Validators.required],
    });
  }

  private populateForm(news: News) {
    this.newsForm.patchValue({
      title: news.title,
      body: news.body,
    });
  }

  onSubmit() {
    if (this.newsForm.valid) {
      this.dialogRef.close({
        action: this.mode,
        data: {
          ...this.newsForm.value,
          ...(this.mode === 'edit' && this.data.news ? { id: this.data.news.id } : {})
        }
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
