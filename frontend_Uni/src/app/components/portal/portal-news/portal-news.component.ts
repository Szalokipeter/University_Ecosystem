import { Component } from '@angular/core';
import { NewsComponent } from '../../main/news/news.component';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NewsFormComponent } from '../news-form/news-form.component';
import { DataService } from '../../../services/data.service';
import { NewsService } from '../../../services/news.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-portal-news',
  standalone: true,
  imports: [NewsComponent, MatButtonModule, MatIconModule, CommonModule],
  templateUrl: './portal-news.component.html',
  styleUrl: './portal-news.component.css',
})
export class PortalNewsComponent {
  message: string = '';
  messageType: 'success' | 'error' | null = null;

  constructor(
    private dialog: MatDialog,
    private dataService: DataService,
    private newsService: NewsService,
  ) {}

  openAddNewsDialog() {
    const dialogRef = this.dialog.open(NewsFormComponent, {
      width: '600px',
      data: { mode: 'add' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.action === 'add') {
        this.dataService.addNews(result.data).subscribe({
          next: (newNews) => {
            this.newsService.prependNews(newNews);
            this.showMessage('News added successfully', 'success');
          },
          error: (err) => {
            this.showMessage('Failed to add news', 'error');
            console.error('Error adding news:', err);
          },
        });
      }
      if (result?.action === 'edit') {
        this.dataService.updateNews(result.data.id, result.data).subscribe({
          next: (updatedNews) => {
            this.newsService.updateNewsItem(updatedNews);
            this.showMessage('News updated successfully', 'success');
          },
          error: (err) => {
            this.showMessage('Failed to update news', 'error');
            console.error('Error updating news:', err);
          }
        });
      }
    });
  }

  showMessage(text: string, type: 'success' | 'error') {
    this.message = text;
    this.messageType = type;
    setTimeout(() => this.clearMessage(), 5000);
  }

  clearMessage() {
    this.message = '';
    this.messageType = null;
  }
}
