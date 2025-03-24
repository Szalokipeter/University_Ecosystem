import { Component } from '@angular/core';
import { SlideCardComponent } from '../slide-card/slide-card.component';
import { NgFor } from '@angular/common';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-slide-card-list',
  imports: [SlideCardComponent, NgFor],
  templateUrl: './slide-card-list.component.html',
  styleUrl: './slide-card-list.component.css',
})
export class SlideCardListComponent {
  cards = [
    {
      title: 'Why are the artistic remains of Byzantium located in Ravenna?',
      topic: 'Art & History',
      background: '/hero/ravenna.jpg',
    },
    {
      title: 'The life and times of Empress Theodora',
      topic: 'Culture & History',
      background: '/hero/theodora.jpg',
    },
    {
      title: '"...each somehow domier than the last"',
      topic: 'Architecture',
      background: '/hero/dome.jpg',
    },
  ];

  activeIndex = 0;

  private slideInterval!: Subscription;

  ngOnInit() {
    // Start the interval to change the slide every 3 seconds (3000ms)
    this.slideInterval = interval(8000).subscribe(() => {
      this.nextSlide();
    });
  }

  ngOnDestroy() {
    // Clean up the subscription to prevent memory leaks
    if (this.slideInterval) {
      this.slideInterval.unsubscribe();
    }
  }

  nextSlide() {
    this.activeIndex = (this.activeIndex + 1) % this.cards.length;
  }

  prevSlide() {
    this.activeIndex = (this.activeIndex - 1 + this.cards.length) % this.cards.length;
  }

  setActive(index: number) {
    this.activeIndex = index;
  }
}
