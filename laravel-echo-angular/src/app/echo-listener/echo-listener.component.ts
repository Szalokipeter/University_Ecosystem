import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LaravelEchoService } from '../laravel-echo.service';

@Component({
  selector: 'app-echo-listener',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './echo-listener.component.html',
  styleUrls: ['./echo-listener.component.css'],
})
export class EchoListenerComponent implements OnInit, OnDestroy {
  messages: string[] = [];
  private channel: any;

  constructor(private echoService: LaravelEchoService) {}

  ngOnInit(): void {
    this.channel = this.echoService.getChannel('qr-login.40OlKKcLo3zZORKBLtupK5IjI8Ybh9Z1');
    console.log(this.channel);
    this.channel.listen('.qr-login-success', (data: any) => {
      console.log('Üzenet érkezett:', data);
      this.messages.push(JSON.stringify(data));
    });
  }

  ngOnDestroy(): void {
    if (this.channel) {
      this.channel.stopListening('.qr-login-success');
    }
  }
}