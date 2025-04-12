import { Injectable, OnDestroy } from '@angular/core';
import Echo from 'laravel-echo';

@Injectable({
  providedIn: 'root',
})
export class LaravelEchoService implements OnDestroy {
  private echo: any;

  constructor() {
    this.echo = new Echo({
      broadcaster: 'reverb',
      key: 'zlzpfxhovyobija8w1il',
      wsHost: '3.127.249.5',
      wsPort: 8080,
      forceTLS: false,
      enabledTransports: ['ws'],
      // disableStats: true,
    });
  }

  ngOnDestroy(): void {
    this.echo.disconnect();
  }

  getChannel(channelName: string) {
    return this.echo.channel(channelName);
  }
}
