import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TelemetryComponent } from './components/telemetry/telemetry.component';
import { LiveStreamComponent } from './components/live-stream/live-stream.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, TelemetryComponent, LiveStreamComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('F1 Live with Telemetry');
}
