import { Component } from '@angular/core';
import { SlideCardListComponent } from '../../components/main/slide-card-list/slide-card-list.component';
import { News } from '../../models/news.model';
import { NewsCardComponent } from '../../components/main/news-card/news-card.component';
import { DataService } from '../../services/data.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-main',
  imports: [SlideCardListComponent, NewsCardComponent, NgFor],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent {
  allNewsList: News[] = [];
  newsList: News[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 4;
  totalPages: number = 1;

  constructor(private dataService: DataService) {
    this.loadNews();
  }

  loadNews() {
    this.dataService.getNews().subscribe({
      next: (response: News[]) => {
        this.allNewsList = response;
        this.totalPages = Math.ceil(this.allNewsList.length / this.itemsPerPage);
        this.updateNewsList();
      },
      error: (error: any) => {
        console.error(error);
      }
    });
  }

  updateNewsList() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.newsList = this.allNewsList.slice(startIndex, startIndex + this.itemsPerPage);
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
}