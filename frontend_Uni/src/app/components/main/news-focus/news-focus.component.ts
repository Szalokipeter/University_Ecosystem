import { Component, EventEmitter, Input, Output } from '@angular/core';
import { News } from '../../../models/news.model';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-news-focus',
  imports: [NgFor],
  templateUrl: './news-focus.component.html',
  styleUrl: './news-focus.component.css'
})
export class NewsFocusComponent {
  @Input() activeNews!: News;
  @Input() otherNews: News[] = [];
  @Output() closeFocus = new EventEmitter<void>();
  @Output() cardClicked = new EventEmitter<News>();

  close() {
    this.closeFocus.emit();
  }

  onCardClick(news: News) {
    this.cardClicked.emit(news);
  }
}