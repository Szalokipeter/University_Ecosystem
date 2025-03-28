import { Component } from '@angular/core';
import { SlideCardListComponent } from '../../components/main/slide-card-list/slide-card-list.component';
import { NewsCardComponent } from '../../components/main/news-card/news-card.component';
import { NewsComponent } from '../../components/main/news/news.component';

@Component({
  selector: 'app-main',
  imports: [SlideCardListComponent, NewsCardComponent, NewsComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent {
  
}
