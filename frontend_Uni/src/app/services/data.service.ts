import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { ConfigService } from './config.service';
import { Observable } from 'rxjs';
import { News } from '../models/news.model';
import { CalendarEvent } from '../models/calendar-event.model';
import { Todo } from '../models/todo.model';
import { UserModel } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class DataService implements OnInit {
  private apiUrl: string;
  private loggedInUser: UserModel | undefined = undefined;

  constructor(private http: HttpClient, private config: ConfigService) {
    this.apiUrl = this.config.apiUrl;
  }

  ngOnInit(): void {    
  }

  getNews(): Observable<News[]> {
    return this.http.get<News[]>(`${this.apiUrl}/news`);
  }

  getPublicEvents(): Observable<CalendarEvent[]> {
    return this.http.get<CalendarEvent[]>(`${this.apiUrl}/uniCalendar`);
  }
  getPersonalEvents(): Observable<CalendarEvent[]> {    
    this.loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '');    
    const token = this.loggedInUser?.token || '';    
    console.log('Token:', token); // Log the token for debugging

    // Create headers with Authorization token
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<CalendarEvent[]>(`${this.apiUrl}/personalCalendar`, {
      headers,
    });
  }

  getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(`${this.apiUrl}/personalTodos`);
  }
}
