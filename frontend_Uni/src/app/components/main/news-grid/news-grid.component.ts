import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { News } from '../../../models/news.model';
import { NgFor, NgIf } from '@angular/common';
import { NewsCardComponent } from '../news-card/news-card.component';

@Component({
  selector: 'app-news-grid',
  imports: [NgFor, NewsCardComponent, NgIf],
  templateUrl: './news-grid.component.html',
  styleUrl: './news-grid.component.css',
})
export class NewsGridComponent {
  @Input() newsList: News[] = [];
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;
  @Output() cardClicked = new EventEmitter<News>();
  @Output() nextPage = new EventEmitter();
  @Output() prevPage = new EventEmitter();

  onCardClick(news: News) {
    this.cardClicked.emit(news);
  }

  notFinalPage() {
    return this.currentPage < this.totalPages ? true : false;
  }
  notFirstPage() {
    return this.currentPage > 1 ? true : false;
  }

  invokeNextPage() {
    this.nextPage.emit();
  }

  invokePrevPage() {
    this.prevPage.emit();
  }
}
