import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EchoListenerComponent } from "./echo-listener/echo-listener.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, EchoListenerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'laravel-echo-angular';
}
