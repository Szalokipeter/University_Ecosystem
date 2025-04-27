import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-slide-card',
  imports: [CommonModule],
  templateUrl: './slide-card.component.html',
  styleUrl: './slide-card.component.css'
})
export class SlideCardComponent {
  @Input() title!: string;
  @Input() topic!: string;
  @Input() background!: string;
}
