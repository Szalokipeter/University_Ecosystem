import { Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Course } from '../../../models/course.model';

@Component({
  selector: 'app-course-card',
  imports: [MatIcon],
  templateUrl: './course-card.component.html',
  styleUrl: './course-card.component.css',
})
export class CourseCardComponent {
  @Input() course: Course | null = null;
}
