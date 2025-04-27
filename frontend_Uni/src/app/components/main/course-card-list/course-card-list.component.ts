import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CourseCardComponent } from '../course-card/course-card.component';
import Swiper from 'swiper';

@Component({
  selector: 'app-course-card-list',
  imports: [CommonModule, MatIconModule, CourseCardComponent],
  templateUrl: './course-card-list.component.html',
  styleUrl: './course-card-list.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CourseCardListComponent {
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

  ngAfterViewInit() {
    new Swiper('.swiper', {
      // Optional parameters
      loop: true,
      centeredSlides: true,
      slidesPerView: 'auto',
      spaceBetween: 50,
      speed: 400,
      autoplay: false,
      slideToClickedSlide: true,

      // If we need pagination
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },

      // Navigation arrows
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },

      breakpoints: {
        0: {
          slidesPerView: 1.2, // Mobile - less peeking
          centeredSlidesBounds: true,
        },
        768: {
          slidesPerView: 1.6, // Tablet - more peeking
        },
        1024: {
          slidesPerView: 4.2, // Desktop - even more peeking
        },
      },
    });
  }
}
