import {
  Component,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { News } from '../../../models/news.model';
import { NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-news-card',
  imports: [NgIf, MatIconModule, MatButtonModule],
  templateUrl: './news-card.component.html',
  styleUrl: './news-card.component.css',
})
export class NewsCardComponent implements OnInit {
  @Input() news!: News;
  @Input() isActive: boolean = false;
  @Input() isSmall: boolean = false;
  @Output() clicked = new EventEmitter<News>();
  @Output() closed = new EventEmitter<void>();
  @Output() edit = new EventEmitter<{ news: News; $event: Event }>();
  @Output() delete = new EventEmitter<{ news: News; $event: Event }>();

  formattedDate: string = '';
  isPortalView = false;

  constructor(private router: Router) {}

  @HostBinding('class.active') get activeClass() {
    return this.isActive;
  }

  @HostBinding('class.small') get smallClass() {
    return this.isSmall;
  }

  ngOnInit() {
    this.formattedDate = new Date(this.news.created_at).toLocaleDateString(
      'en-US',
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }
    );

    this.isPortalView = this.router.url.includes('/portal/');
  }

  @HostListener('click', ['$event'])
  onCardClick(event: Event) {
    if (
      !this.isPortalView &&
      !(event.target as HTMLElement).closest('button')
    ) {
      this.clicked.emit(this.news);
    }
  }

  closeCard(event: Event) {
    event.stopPropagation();
    this.closed.emit();
  }

  onEdit(event: Event) {
    event.stopPropagation();
    this.edit.emit({ news: this.news, $event: event });
  }

  onDelete(event: Event) {
    event.stopPropagation();
    this.delete.emit({ news: this.news, $event: event });
  }
}
