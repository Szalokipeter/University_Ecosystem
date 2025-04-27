import {
  Component,
  Input,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { News } from '../../../models/news.model';
import { DataService } from '../../../services/data.service';
import { NewsCardComponent } from '../news-card/news-card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-news-grid',
  templateUrl: './news-grid.component.html',
  styleUrls: ['./news-grid.component.css'],
  imports: [NewsCardComponent, CommonModule],
})
export class NewsGridComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  private _newsMap = new Map<string, News[]>();

  @Input() newsList: News[] = [];
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;
  @Input() isSmall: boolean = false;

  @Output() pageChanged = new EventEmitter<number>();
  @Output() cardClicked = new EventEmitter<News>();
  @Output() edit = new EventEmitter<{news: News, $event: Event}>();
  @Output() delete = new EventEmitter<{news: News, $event: Event}>();

  loading = false;
  error: string | null = null;

  constructor() {}

  // Pagination methods
  notFirstPage(): boolean {
    return this.currentPage > 1;
  }

  notFinalPage(): boolean {
    return this.currentPage < this.totalPages;
  }

  invokePrevPage() {
    if (this.notFirstPage()) {
      this.pageChanged.emit(this.currentPage - 1);
    }
  }

  invokeNextPage() {
    if (this.notFinalPage()) {
      this.pageChanged.emit(this.currentPage + 1);
    }
  }

  // CRUD operations
  onEdit(eventData: {news: News, $event: Event}) {
    eventData.$event.stopPropagation();
    this.edit.emit(eventData);
  }

  onDelete(eventData: {news: News, $event: Event}) {
    eventData.$event.stopPropagation();
    this.delete.emit(eventData);
  }

  onCardClick(news: News) {
    this.cardClicked.emit(news);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
