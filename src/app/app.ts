import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TelemetryComponent } from './components/telemetry/telemetry.component';
import { LiveStreamComponent } from './components/live-stream/live-stream.component';
import { RaceStandingsComponent, RaceDriver } from './components/race-standings/race-standings.component';
import { TrackMapComponent } from './components/track-map/track-map.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, TelemetryComponent, LiveStreamComponent, RaceStandingsComponent, TrackMapComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('F1 Live with Telemetry');
  selectedDriver = signal<RaceDriver | null>(null);

  onDriverSelected(driver: RaceDriver): void {
    this.selectedDriver.set(driver);
  }

  get selectedDriverNumber(): number | null {
    return this.selectedDriver()?.number ?? null;
  }
}
