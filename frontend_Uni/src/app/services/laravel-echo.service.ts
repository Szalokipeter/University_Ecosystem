import { Injectable, OnDestroy } from '@angular/core';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

@Injectable({
  providedIn: 'root',
})
export class LaravelEchoService implements OnDestroy {
  private echo: any;

  constructor() {
    this.echo = new Echo({
      broadcaster: 'reverb',
      key: 'zlzpfxhovyobija8w1il',
      wsHost: 'localhost',
      wsPort: 8080,
      wssPort: 443,
      forceTLS: false,
      enabledTransports: ['ws', 'wss'],
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
