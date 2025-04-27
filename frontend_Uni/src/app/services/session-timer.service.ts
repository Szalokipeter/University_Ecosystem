import { Injectable } from '@angular/core';
import { interval, Subject, takeUntil } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class SessionTimerService {
  private destroy$ = new Subject<void>();
  remainingTime: number = 0;
  timerActive = false;

  constructor(private authService: AuthService, private router: Router) {}

  startTimer(): void {
    if (this.timerActive) return;

    const initialRemaining = this.authService.getRemainingTime();

    if (initialRemaining <= 0) {
      console.warn('Token already expired!');
      this.handleExpiration();
      return;
    }

    this.timerActive = true;
    this.updateRemainingTime();

    interval(1000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateRemainingTime();
        if (this.authService.isTokenExpired()) {
          this.handleExpiration();
        }
      });
  }

  private updateRemainingTime(): void {
    this.remainingTime = this.authService.getRemainingTime();
  }

  private handleExpiration(): void {
    this.stopTimer();
    this.authService.logout();
    this.router.navigate(['/login']);
    this.stopTimer();
  }

  stopTimer(): void {
    this.timerActive = false;
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  formatTime(ms: number): string {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}
