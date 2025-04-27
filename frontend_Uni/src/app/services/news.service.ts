import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { News } from '../models/news.model';

@Injectable({ providedIn: 'root' })
export class NewsService {
  private newsSubject = new BehaviorSubject<News[]>([]);
  news$ = this.newsSubject.asObservable();

  // Update entire list
  updateNewsList(news: News[]) {
    this.newsSubject.next(news);
  }

  // Add single news to beginning
  prependNews(news: News) {
    const current = this.newsSubject.value;
    this.newsSubject.next([news, ...current]);
  }

  // For edit operations
  updateNewsItem(updatedNews: News) {
    const current = this.newsSubject.value;
    this.newsSubject.next(
      current.map(item => item.id === updatedNews.id ? updatedNews : item)
    );
  }

  // For delete operations
  removeNewsItem(id: number) {
    const current = this.newsSubject.value;
    this.newsSubject.next(current.filter(item => item.id !== id));
  }
}