import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { LaravelEchoService } from '../../services/laravel-echo.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  @ViewChild('qrCodeContainer') qrCodeContainer!: ElementRef;

  model = {
    email: '',
    password: '',
  };
  qrtoken: string | undefined = undefined;
  errorMessage = '';
  isLoading = false;
  private channel: any;

  constructor(
    private authService: AuthService,
    private echoService: LaravelEchoService,
    private router: Router
  ) {}

  login() {
    if (!this.model.email || !this.model.password) {
      this.errorMessage = 'Email cím és jelszó megadása kötelező!';
      return;
    }
    this.authService.login(this.model.email, this.model.password).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response) {
          this.router.navigate(['portal']);
        } else {
          this.errorMessage = 'Helytelen email cím vagy jelszó!';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error.message ?? error.message;
      },
    });
  }
  showQrCode() {
    this.isLoading = true;
    this.errorMessage = '';
    this.qrtoken = undefined;

    this.authService.generateQrCode().subscribe({
      next: (response) => {
        if (response) {
          console.log(`qrcode-token: ${response}`);
          const baseuri = `https://api.qrserver.com/v1/create-qr-code/?data=${response}&size=300x300`;
          this.qrtoken = baseuri;

          // Initialize Echo channel
          this.setupQrChannel(response);

          setTimeout(() => {
            if (this.qrCodeContainer) {
              this.qrCodeContainer.nativeElement.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
              });
            }
          }, 100);

          // Set timeout for QR code expiration (5 minutes)
          setTimeout(() => {
            if (this.qrtoken) {
              this.handleQrExpiration();
            }
          }, 300000);
        } else {
          this.handleQrError('Invalid QR code response from server');
        }
      },
      error: (error) => {
        this.handleQrError(
          error.error?.message || error.message || 'Failed to generate QR code'
        );
      },
    });
  }

  private setupQrChannel(token: string): void {
    console.log('[QR] Setting up channel for token:', token);

    this.channel = this.echoService.getChannel(`qr-login.${token}`);

    // Listen for all events on the channel for debugging
    this.channel.listen('.qr-login-success', (data: any) => {
      console.log('[QR] Received success event:', data);
      this.handleQrSuccess(data);
    });

    // Add wildcard listener to catch all events
    this.channel.listen('*', (event: string, data: any) => {
      console.log(`[QR] Received event '${event}':`, data);
    });

    this.channel.error((error: any) => {
      console.error('[QR] Channel error:', error);
      this.handleQrError('Channel error occurred');
    });

    // Add timeout to detect silent failures
    setTimeout(() => {
      if (this.qrtoken) {
        console.warn('[QR] No event received within timeout period');
        this.handleQrError('No response from server');
      }
    }, 30000); // 30 second timeout
  }

  private handleQrSuccess(data: any): void {
    this.isLoading = false;

    if (data.Authtoken) {
      // Store the token first
      this.authService.storeToken(data.Authtoken);

      // Then fetch user details
      this.authService.fetchUserWithToken(data.Authtoken).subscribe({
        next: (user) => {
          this.router.navigate(['portal']);
        },
        error: (error) => {
          this.handleQrError('Failed to load user details');
          console.error('User fetch error:', error);
        },
      });
    } else {
      this.handleQrError('Authentication token missing in response');
    }
  }

  private handleQrError(message: string): void {
    this.isLoading = false;
    this.errorMessage = message;
    this.qrtoken = undefined;
    this.cleanupChannel();
  }

  private handleQrExpiration(): void {
    this.isLoading = false;
    this.errorMessage = 'QR code expired. Please generate a new one.';
    this.qrtoken = undefined;
    this.cleanupChannel();
  }

  private cleanupChannel(): void {
    if (this.channel) {
      this.channel.stopListening('.qr-login-success');
      this.channel = null;
    }
  }
  ngOnDestroy(): void {
    if (this.channel) {
      this.channel.stopListening('.qr-login-success');
      this.channel = null;
    }
  }
}
