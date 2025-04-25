import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { ConfigService } from './config.service';
import { map, Observable } from 'rxjs';
import { News } from '../models/news.model';
import { CalendarEvent } from '../models/calendar-event.model';
import { Todo } from '../models/todo.model';
import {
  AddUserPayload,
  ApiErrorResponse,
  ApiSuccessResponse,
  EditUserPayload,
  UserModel,
} from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class DataService implements OnInit {
  private apiUrl: string;
  private loggedInUser: UserModel | undefined = undefined;

  constructor(private http: HttpClient, private config: ConfigService) {
    this.apiUrl = this.config.apiUrl;
  }

  ngOnInit(): void {}

  private getAuthHeaders(): HttpHeaders {
    this.loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '');
    const token = this.loggedInUser?.token || '';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  getNews(): Observable<News[]> {
    return this.http.get<News[]>(`${this.apiUrl}/news`);
  }
  addNews(news: Omit<News, 'id'>): Observable<News> {
    return this.http.post<News>(`${this.apiUrl}/news`, news, {
      headers: this.getAuthHeaders(),
    });
  }
  updateNews(id: number, news: Partial<News>): Observable<News> {
    return this.http.put<News>(`${this.apiUrl}/news/${id}`, news, {
      headers: this.getAuthHeaders(),
    });
  }
  deleteNews(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/news/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  //#region Calendar Events
  getPublicEvents(): Observable<CalendarEvent[]> {
    return this.http.get<CalendarEvent[]>(`${this.apiUrl}/uniCalendar`);
  }
  getPersonalEvents(): Observable<CalendarEvent[]> {
    return this.http.get<CalendarEvent[]>(`${this.apiUrl}/personalCalendar`, {
      headers: this.getAuthHeaders(),
    });
  }
  createCalendarEvent(
    event: Partial<CalendarEvent>,
    isPublic: boolean
  ): Observable<CalendarEvent> {
    const endpoint = isPublic ? 'uniCalendar' : 'personalCalendar';
    return this.http.post<CalendarEvent>(`${this.apiUrl}/${endpoint}`, event, {
      headers: this.getAuthHeaders(),
    });
  }
  updateCalendarEvent(
    id: number,
    event: Partial<CalendarEvent>,
    isPublic: boolean
  ): Observable<CalendarEvent> {
    const endpoint = isPublic ? 'uniCalendar' : 'personalCalendar';
    return this.http.put<CalendarEvent>(
      `${this.apiUrl}/${endpoint}/${id}`,
      event,
      {
        headers: this.getAuthHeaders(),
      }
    );
  }
  deleteCalendarEvent(id: number, isPublic: boolean): Observable<void> {
    const endpoint = isPublic ? 'uniCalendar' : 'personalCalendar';
    return this.http.delete<void>(`${this.apiUrl}/${endpoint}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
  //#endregion

  //#region Todos
  getPersonalTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(`${this.apiUrl}/personalTodos`, {
      headers: this.getAuthHeaders(),
    });
  }
  getPersonalTodo(id: number): Observable<Todo> {
    return this.http.get<Todo>(`${this.apiUrl}/personalTodos/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
  createTodo(todo: Partial<Todo>): Observable<Todo> {
    return this.http.post<Todo>(`${this.apiUrl}/personalTodos`, todo, {
      headers: this.getAuthHeaders(),
    });
  }
  updateTodo(id: number, todo: Partial<Todo>): Observable<Todo> {
    return this.http.put<Todo>(`${this.apiUrl}/personalTodos/${id}`, todo, {
      headers: this.getAuthHeaders(),
    });
  }
  destroyTodo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/personalTodos/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
  //#endregion

  //#region Users
  getAllUsers(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(`${this.apiUrl}/users`, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(response => Array.isArray(response) ? response : [response])
    );
  }
  searchUser(token: string): Observable<UserModel> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.get<UserModel>(`${this.apiUrl}/user`, {
      headers,
    });
  }

  editUser(
    userId: number,
    payload: EditUserPayload
  ): Observable<ApiSuccessResponse | ApiErrorResponse> {
    // Only include password fields if password is being changed
    const requestPayload = !payload.password
      ? { username: payload.username }
      : payload;

    return this.http.put<ApiSuccessResponse | ApiErrorResponse>(
      `${this.apiUrl}/users/${userId}`,
      requestPayload,
      { headers: this.getAuthHeaders() }
    );
  }

  addUser(
    payload: AddUserPayload
  ): Observable<ApiSuccessResponse | ApiErrorResponse> {
    return this.http.post<ApiSuccessResponse | ApiErrorResponse>(
      `${this.apiUrl}/admin/register`,
      payload,
      { headers: this.getAuthHeaders() }
    );
  }

  getPersonalEventsForUser(userId: number): Observable<CalendarEvent[]> {
    return this.http.get<CalendarEvent[]>(
      `${this.apiUrl}/admin/users/${userId}/personalCalendar`,
      { headers: this.getAuthHeaders() }
    );
  }

  getPersonalTodosForUser(userId: number): Observable<Todo[]> {
    return this.http.get<Todo[]>(
      `${this.apiUrl}/admin/users/${userId}/personalTodos`,
      { headers: this.getAuthHeaders() }
    );
  }

  checkEventSignup(eventId: number): Observable<{ signedUp: boolean }> {
    return this.http.get<{ signedUp: boolean }>(
      `${this.apiUrl}/uniCalendar/${eventId}/signup`,
      { headers: this.getAuthHeaders() }
    );
  }
  
  signUpForEvent(eventId: number): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/uniCalendar/${eventId}/signup`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }
  //#endregion
}
