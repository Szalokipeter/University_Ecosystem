import { Component, HostListener, OnInit } from '@angular/core';
import { News } from '../../../models/news.model';
import { DataService } from '../../../services/data.service';
import { NewsGridComponent } from '../news-grid/news-grid.component';
import { NewsFocusComponent } from '../news-focus/news-focus.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-news',
  imports: [NewsGridComponent, NewsFocusComponent, NgIf],
  templateUrl: './news.component.html',
  styleUrl: './news.component.css',
})
export class NewsComponent {
  allNewsList: News[] = [];
  newsList: News[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 4;
  totalPages: number = 1;
  activeNews: News | null = null;

  constructor(private dataService: DataService) {
    this.loadNews();
  }

  loadNews() {
    this.dataService.getNews().subscribe({
      next: (response: News[]) => {
        this.allNewsList = response;
        this.totalPages = Math.ceil(
          this.allNewsList.length / this.itemsPerPage
        );
        this.updateNewsList();
      },
      error: (error: any) => {
        console.error(error);
      },
    });
  }

  updateNewsList() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.newsList = this.allNewsList.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateNewsList();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateNewsList();
    }
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
    console.log(`closeFocus called, activeNews = ${this.activeNews}`);
  }

  onCardClick(news: News) {
    this.activeNews = news;
  }
  
}
