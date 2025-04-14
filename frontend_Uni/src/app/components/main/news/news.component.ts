import { Component, OnInit, OnDestroy } from '@angular/core';
import { News } from '../../../models/news.model';
import { DataService } from '../../../services/data.service';
import { NewsGridComponent } from '../news-grid/news-grid.component';
import { NewsFocusComponent } from '../news-focus/news-focus.component';
import { NgIf } from '@angular/common';
import { NewsService } from '../../../services/news.service';
import { Subject, distinctUntilChanged, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NewsFormComponent } from '../../portal/news-form/news-form.component';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [NewsGridComponent, NewsFocusComponent, NgIf],
  templateUrl: './news.component.html',
  styleUrl: './news.component.css',
})
export class NewsComponent implements OnInit, OnDestroy {
  allNewsList: News[] = [];
  newsList: News[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 4;
  totalPages: number = 1;
  activeNews: News | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private dataService: DataService,
    private newsService: NewsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadInitialNews();
    this.setupNewsUpdates();
  }

  loadInitialNews() {
    this.dataService.getNews().subscribe({
      next: (response: News[]) => {
        this.newsService.updateNewsList(response);
      },
      error: (error: any) => {
        console.error(error);
      },
    });
  }

  private setupNewsUpdates() {
    this.newsService.news$
      .pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
      )
      .subscribe((news) => {
        this.processNewsList(news);
      });
  }

  private processNewsList(news: News[]) {
    const currentVisibleIds = new Set(this.newsList.map((n) => n.id));

    this.allNewsList = news;
    this.totalPages = Math.ceil(this.allNewsList.length / this.itemsPerPage);

    // Adjust page if current items are no longer in the list
    if (
      this.newsList.length > 0 &&
      !this.newsList.some((n) => news.some((m) => m.id === n.id))
    ) {
      this.currentPage = 1;
    }

    this.updateNewsList();
  }

  updateNewsList() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.newsList = this.allNewsList.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }

  onEdit(eventData: { news: News; $event: Event }) {
    this.openEditDialog(eventData.news, eventData.$event);
  }

  private openEditDialog(news: News, event: Event) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(NewsFormComponent, {
      width: '600px',
      data: { mode: 'edit', news },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.action === 'edit') {
        this.dataService.updateNews(result.data.id, result.data).subscribe({
          next: (updatedNews) => {
            this.newsService.updateNewsItem(updatedNews);
            this.snackBar.open('News updated successfully', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar'],
            });
          },
          error: (err) => {
            this.snackBar.open('Failed to update news', 'Close', {
              duration: 5000,
              panelClass: ['error-snackbar'],
            });
            console.error('Error updating news:', err);
          },
        });
      }
    });
  }

  onDelete(eventData: { news: News; $event: Event }) {
    eventData.$event.stopPropagation();

    if (window.confirm('Are you sure you want to delete this news item?')) {
      this.dataService.deleteNews(eventData.news.id).subscribe({
        next: () => {
          this.newsService.removeNewsItem(eventData.news.id);
          this.snackBar.open('News deleted successfully', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar'],
          });
        },
        error: (err) => {
          this.snackBar.open('Failed to delete news', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar'],
          });
          console.error('Delete error:', err);
        },
      });
    }
  }

  onPageChange(newPage: number) {
    this.currentPage = newPage;
    this.updateNewsList();
  }

  toggleFocus(news: News) {
    if (this.activeNews === news) {
      this.closeFocus();
    } else {
      this.activeNews = news;
    }
  }

  closeFocus() {
    this.activeNews = null;
  }

  onCardClick(news: News) {
    this.activeNews = news;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
