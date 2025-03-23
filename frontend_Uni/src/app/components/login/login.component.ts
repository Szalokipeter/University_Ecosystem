import { Component, OnInit, OnDestroy } from '@angular/core';
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
  model = {
    email: '',
    password: '',
  };
  qrtoken : string | undefined = undefined;
  errorMessage = '';
  private channel : any;
  constructor(private authService: AuthService, private echoService: LaravelEchoService ,private router: Router) {}

  login() {
    if (!this.model.email || !this.model.password) {
      this.errorMessage = 'Email cím és jelszó megadása kötelező!';
      return;
    }
    this.authService.login(this.model.email, this.model.password).subscribe({
      next: (response) => {
        if (response) {
          if (this.authService.loggedInUser?.roles_id == 1) {
            this.router.navigate(['admin']);
          } else {
            this.router.navigate(['']);
          }
        } else {
          this.errorMessage = 'Helytelen email cím vagy jelszó!';
        }
      },
      error: (error) => {
        this.errorMessage = error.error.message ?? error.message;
      },
    });
  }
  showQrCode(){
    this.authService.generateQrCode().subscribe({
      next: (response) => {
        if (response) {
          console.log(`qrcode-token: ${response}`);
          let baseuri = `https://api.qrserver.com/v1/create-qr-code/?data=${response}&size=300x300`;
          this.qrtoken = baseuri;
          this.channel = this.echoService.getChannel(`qr-login.${response}`);
          console.log(this.channel);
          this.channel.listen('.qr-login-success', (data: any) => {
            console.log('Üzenet érkezett:', data);
            // marker for frontend
          });
          this.channel.error((error: any) => {
            console.error('Channel error:', error);
          });
        } else {
          this.errorMessage = 'Hiba.';
        }
      },
      error: (error) => {
        this.errorMessage = error.error.message ?? error.message;
      },
    });
  }
  ngOnDestroy(): void {
    if (this.channel) {
      this.channel.stopListening('.qr-login-success');
    }
  }
}
