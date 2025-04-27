import { Injectable, OnDestroy } from '@angular/core';
import Echo from 'laravel-echo';

@Injectable({
  providedIn: 'root',
})
export class LaravelEchoService implements OnDestroy {
  private echo: any;
  private connectionEstablished = false;

  constructor() {
    this.initializeEcho();
  }

  private initializeEcho() {
    this.echo = new Echo({
      broadcaster: 'reverb',
      key: 'zlzpfxhovyobija8w1il',
      wsHost: '52.28.154.228',
      wsPort: 8080,
      forceTLS: false,
      enabledTransports: ['ws'],
    });

    this.echo.connector.pusher.connection.bind('connecting', () => {
      console.log('[WebSocket] Connecting...');
    });

    this.echo.connector.pusher.connection.bind('connected', () => {
      console.log('[WebSocket] Connected successfully');
    });

    this.echo.connector.pusher.connection.bind('error', (error: any) => {
      console.error('[WebSocket] Connection error:', error);
    });
  }

  getChannel(channelName: string) {
    console.log(`[Echo] Creating channel: ${channelName}`);
    const channel = this.echo.channel(channelName);

    channel.subscribed(() => {
      console.log(`[Echo] Subscribed to channel: ${channelName}`);
    });

    return channel;
  }

  ngOnDestroy() {
    this.echo?.disconnect();
  }
}
