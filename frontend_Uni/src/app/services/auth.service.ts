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
            issuedAt: Date.now(),
          };

          localStorage.setItem(
            'loggedInUser',
            JSON.stringify(this.loggedInUser)
          );

          this.storeToken(response.token);

          return true;
        })
      );
  }

  fetchUserWithToken(token: string): Observable<UserModel> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http
      .get<UserModel>(`${this.config.apiUrl}/user`, { headers })
      .pipe(
        map((user: any) => {
          this.loggedInUser = {
            username: user.username,
            email: user.email,
            token: token,
            roles_id: user.roles_id,
          };

          localStorage.setItem(
            'loggedInUser',
            JSON.stringify(this.loggedInUser)
          );
          return this.loggedInUser;
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
  storeToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  debugToken(): void {
    const token = this.getToken();
    console.log('Stored token:', token);
    console.log('Is logged in:', this.isLoggedIn());
  }

  isLoggedIn(): boolean {
    const user = localStorage.getItem('loggedInUser');
    const token = localStorage.getItem('auth_token');
    return !!user && !!token;
  }

  getCurrentUser(): UserModel | null {
    const user = localStorage.getItem('loggedInUser');
    return user ? JSON.parse(user) : null;
  }

  logout() {
    if (localStorage.getItem('loggedInUser') !== null) {
      this.loggedInUser = JSON.parse(
        localStorage.getItem('loggedInUser') || ''
      );
      const headers = new HttpHeaders({
        Authorization: `Bearer ${this.loggedInUser?.token}`,
      });

      this.http
        .post(`${this.config.apiUrl}/logout`, {}, { headers })
        .subscribe({
          next: () => {
            this.loggedInUser = undefined;
            localStorage.removeItem('loggedInUser');
            localStorage.removeItem('auth_token');
            // Optional: Redirect to login page or handle post-logout logic
          },
          error: (err) => {
            console.error('Logout failed:', err);
            // Still clear local state even if server logout fails
            this.loggedInUser = undefined;
            localStorage.removeItem('loggedInUser');
            localStorage.removeItem('auth_token');
          },
        });
    } else {
      localStorage.removeItem('loggedInUser');
      this.loggedInUser = undefined;
      localStorage.removeItem('auth_token');
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

  getTokenExpiration(): number {
    const user = this.getCurrentUser();
    if (!user || !user.issuedAt) return 0;
    return user.issuedAt + 12 * 60 * 1000; // 12 minutes
  }

  getRemainingTime(): number {
    try {
      const user = this.getCurrentUser();
      if (!user?.issuedAt) throw new Error('No valid session');

      const expirationTime = user.issuedAt + 12 * 60 * 1000;
      return Math.max(0, expirationTime - Date.now());
    } catch (error) {
      console.error('Error calculating remaining time:', error);
      this.logout();
      return 0;
    }
  }

  isTokenExpired(): boolean {
    try {
      const user = this.getCurrentUser();
      if (!user?.issuedAt) return true;

      return Date.now() > user.issuedAt + 12 * 60 * 1000;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  }
}
