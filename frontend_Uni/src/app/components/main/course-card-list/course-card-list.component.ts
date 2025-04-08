import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CourseCardComponent } from '../course-card/course-card.component';

@Component({
  selector: 'app-course-card-list',
  imports: [CommonModule, MatIconModule, CourseCardComponent],
  templateUrl: './course-card-list.component.html',
  styleUrl: './course-card-list.component.css',
})
export class CourseCardListComponent {
  @ViewChild('scroller') scroller!: ElementRef;

  courses = [
    {
      title: 'Ancient Greek Literature',
      description:
        'Study Homer, Plato, and the tragedians in their original language.',
      icon: 'menu_book',
    },
    {
      title: 'Byzantine Theology',
      description:
        'Explore the theological debates of the Eastern Orthodox tradition.',
      icon: 'church',
    },
    {
      title: 'Classical Philosophy',
      description: 'Examine the works of Aristotle, Plato, and the Stoics.',
      icon: 'psychology',
    },
    {
      title: 'Roman & Byzantine Law',
      description:
        "Trace legal systems from Justinian's Code to modern influences.",
      icon: 'gavel',
    },
    {
      title: 'Medicine',
      description: 'Study ancient medical practices and their evolution.',
      icon: 'medical_services',
    },
    {
      title: 'Imperial Architecture',
      description:
        'Master the construction techniques of Hagia Sophia and Byzantine monuments.',
      icon: 'architecture',
    },
    {
      title: 'Diplomatic Rhetoric',
      description:
        'Learn the art of negotiation as practiced in the Imperial Court.',
      icon: 'record_voice_over',
    },
    {
      title: 'Military Strategy',
      description:
        'Study the tactics that defended Constantinople for centuries.',
      icon: 'military_tech',
    },
  ];

  displayCourses  = [...this.courses, ...this.courses];
  currentIndex = this.courses.length;

  scrollTo(direction: 'left' | 'right') {
    const container = this.scroller.nativeElement;
    const cardWidth = 320; // Match your CSS card width + margin
    
    this.currentIndex += direction === 'left' ? -1 : 1;
    
    // Smooth scroll to next card
    container.scrollTo({
      left: this.currentIndex * cardWidth,
      behavior: 'smooth'
    });

    // Silent infinite loop
    if (this.currentIndex <= 0) {
      this.currentIndex = this.courses.length;
      setTimeout(() => {
        container.scrollTo({ 
          left: this.currentIndex * cardWidth, 
          behavior: 'auto' 
        });
      }, 300);
    } 
    else if (this.currentIndex >= this.courses.length * 2) {
      this.currentIndex = this.courses.length;
      setTimeout(() => {
        container.scrollTo({ 
          left: this.currentIndex * cardWidth, 
          behavior: 'auto' 
        });
      }, 300);
    }
  }
}