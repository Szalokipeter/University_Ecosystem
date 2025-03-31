import { Component, ElementRef, EventEmitter, HostBinding, HostListener, Input, OnInit, Output } from '@angular/core';
import { News } from '../../../models/news.model';
import { NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-news-card',
  imports: [NgIf, MatIconModule],
  templateUrl: './news-card.component.html',
  styleUrl: './news-card.component.css'
})
export class NewsCardComponent implements OnInit {
  @Input() news!: News;
  @Output() closed = new EventEmitter<void>();

  formattedDate: string = '';
  truncatedBody: string = '';
  isSmallCard = false;
  showCloseButton = false;

  private observer: MutationObserver;

  constructor(private elementRef: ElementRef) {
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          this.isSmallCard = this.elementRef.nativeElement.classList.contains('small');
          this.showCloseButton = this.elementRef.nativeElement.classList.contains('active');
        }
      });
    });
  }

  ngOnInit() {
    this.formattedDate = new Date(this.news.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    this.isSmallCard = this.elementRef.nativeElement.classList.contains('small');
    this.showCloseButton = this.elementRef.nativeElement.classList.contains('active');

    this.observer.observe(this.elementRef.nativeElement, {
      attributes: true,
      attributeFilter: ['class']
    });
  }

  ngOnDestroy() {
    this.observer.disconnect();
  }

  closeCard() {
    this.closed.emit();
  }
}