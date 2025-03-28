import { Component, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { News } from '../../../models/news.model';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-news-card',
  imports: [NgIf],
  templateUrl: './news-card.component.html',
  styleUrl: './news-card.component.css'
})
export class NewsCardComponent implements OnInit {
  @Input() news!: News;
  formattedDate: string = '';
  truncatedBody: string = '';
  isSmallCard = false;

  private observer: MutationObserver;

  constructor(private elementRef: ElementRef) {
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          this.isSmallCard = this.elementRef.nativeElement.classList.contains('small');
        }
      });
    });

    this.observer.observe(this.elementRef.nativeElement, {
      attributes: true,
      attributeFilter: ['class']
    });
  }
  
  ngOnInit() {
    this.formattedDate = new Date(this.news.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    this.isSmallCard = this.elementRef.nativeElement.classList.contains('small');
  }

  ngOnDestroy() {
    this.observer.disconnect();
  }
}