import { Component, Input, OnInit } from '@angular/core';
import { News } from '../../../models/news.model';

@Component({
  selector: 'app-news-card',
  imports: [],
  templateUrl: './news-card.component.html',
  styleUrl: './news-card.component.css'
})
export class NewsCardComponent implements OnInit {
  @Input() news!: News;
  formattedDate: string = '';
  truncatedBody: string = '';

  ngOnInit() {
    this.formattedDate = new Date(this.news.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    this.truncatedBody = this.news.body.length > 120 
      ? this.news.body.substring(0, 120) + '...'
      : this.news.body;
  }
}