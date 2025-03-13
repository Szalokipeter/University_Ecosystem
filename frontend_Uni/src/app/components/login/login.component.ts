import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
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
  constructor(private authService: AuthService, private router: Router) {}

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
          console.log(`response: ${response}`);
          let baseuri = `https://api.qrserver.com/v1/create-qr-code/?data=${response}&size=300x300`;
          this.qrtoken = baseuri;

        } else {
          this.errorMessage = 'Hiba.';
        }
      },
      error: (error) => {
        this.errorMessage = error.error.message ?? error.message;
      },
    });
  }
}
