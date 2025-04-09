import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import Pusher from 'pusher-js';
import { register } from 'swiper/element/bundle';

register();

(window as any).Pusher = Pusher;
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
