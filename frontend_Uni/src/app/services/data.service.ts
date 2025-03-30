import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { Observable } from 'rxjs';
import { News } from '../models/news.model';
import { CalendarEvent } from '../models/calendar-event.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl: string;

  constructor(private http: HttpClient, private config: ConfigService) {
    this.apiUrl = this.config.apiUrl;
  }
  
  getNews(): Observable<News[]> {
    return this.http.get<News[]>(`${this.apiUrl}/news`);
  }

  getPublicEvents(): Observable<CalendarEvent[]> {
    return this.http.get<CalendarEvent[]>(`${this.apiUrl}/uniCalendar`);
  }
}
