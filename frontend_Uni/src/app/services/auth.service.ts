import { Injectable } from '@angular/core';
import { UserModel } from '../models/user.model';
import { ConfigService } from './config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  loggedInUser: UserModel | undefined = undefined;
  qrCode: string | undefined = undefined;

  constructor(private config: ConfigService, private http: HttpClient) {}

  login(email: string, password: string): Observable<boolean> {
    return this.http
      .post<UserModel>(`${this.config.apiUrl}/login`, { email, password })
      .pipe(
        map((response: any) => {
          this.loggedInUser = {
            username: response.user.username,
            email: response.user.email,
            token: response.token,
            roles_id: response.user.roles_id,
          };

          localStorage.setItem(
            'loggedInUser',
            JSON.stringify(this.loggedInUser)
          );
          return true;
        })
      );
  }
  generateQrCode(): Observable<any> {
    return this.http
      .post<UserModel>(`${this.config.apiUrl}/qrcode/generate`, {})
      .pipe(
        map((response: any) => {
          this.qrCode = response.qrcode;
          return this.qrCode;
        })
      );
  }

  logout() {
    if (localStorage.getItem('loggedInUser') !== null) {
      this.loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '');    
      const headers = new HttpHeaders({
        Authorization: `Bearer ${this.loggedInUser?.token}`,
      });
  
      this.http.post(`${this.config.apiUrl}/logout`, {}, { headers }).subscribe({
        next: () => {
          this.loggedInUser = undefined;
          localStorage.removeItem('loggedInUser');
          // Optional: Redirect to login page or handle post-logout logic
        },
        error: (err) => {
          console.error('Logout failed:', err);
          // Still clear local state even if server logout fails
          this.loggedInUser = undefined;
          localStorage.removeItem('loggedInUser');
        },
      });      
    } else {
      localStorage.removeItem('loggedInUser');
      this.loggedInUser = undefined;
    }
  }

  checkUser() {
    let user: UserModel = JSON.parse(
      localStorage.getItem('loggedInUser') || ''
    );
    if (user) {
      this.loggedInUser = user;
    }
  }

  isAdminOrTeacher(): boolean {
    if (localStorage.getItem('loggedInUser') === null) {
      return false;      
    }
    this.loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '');
    return (
      this.loggedInUser?.roles_id === 1 || this.loggedInUser?.roles_id === 2
    );
  }
}
