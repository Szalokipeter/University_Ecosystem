import { Component, EventEmitter, Input, Output } from '@angular/core';
import { News } from '../../../models/news.model';
import { NgFor } from '@angular/common';
import { NewsCardComponent } from '../news-card/news-card.component';

@Component({
  selector: 'app-news-focus',
  imports: [NgFor, NewsCardComponent],
  templateUrl: './news-focus.component.html',
  styleUrl: './news-focus.component.css'
})
export class NewsFocusComponent {
  @Input() newsList: News[] = [];
  @Input() activeNews!: News;
  @Output() closeFocus = new EventEmitter<void>();
  @Output() cardClicked = new EventEmitter<News>();

  close() {
    this.closeFocus.emit();
    console.log('close emited');
  }

  onCardClick(news: News) {
    this.cardClicked.emit(news);
  }

  get otherNews(): News[] {
    return this.newsList.filter((n) => n !== this.activeNews);
  }

  isActiveNews(newsItem: News): boolean {
    return this.activeNews === newsItem;
  }
}