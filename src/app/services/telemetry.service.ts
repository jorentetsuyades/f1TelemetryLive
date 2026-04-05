import { Injectable } from '@angular/core';
import { Observable, interval, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

export interface TelemetryData {
  speed: number;
  rpm: number;
  throttle: number;
  brake: number;
  gear: number;
  drs: boolean;
  lapTime: string;
  trackTemp: number;
  carTemp: number;
  fuel: number;
}

// Smooth simulation state
interface SimState {
  speed: number;
  rpm: number;
  throttle: number;
  brake: number;
  gear: number;
  drs: boolean;
  fuel: number;
  trackTemp: number;
  carTemp: number;
  lapMs: number;
  phase: 'straight' | 'braking' | 'corner' | 'accel';
  phaseMs: number;
}

@Injectable({
  providedIn: 'root'
})
export class TelemetryService {
  private sim: SimState = {
    speed: 280, rpm: 11000, throttle: 90, brake: 0,
    gear: 7, drs: true, fuel: 87, trackTemp: 44, carTemp: 98,
    lapMs: 12000, phase: 'straight', phaseMs: 0
  };

  private readonly PHASES: Record<SimState['phase'], number> = {
    straight: 5000, braking: 2000, corner: 3000, accel: 3000
  };

  private readonly NEXT_PHASE: Record<SimState['phase'], SimState['phase']> = {
    straight: 'braking', braking: 'corner', corner: 'accel', accel: 'straight'
  };

  private snapshot: TelemetryData = this.buildSnapshot();
  private subject = new BehaviorSubject<TelemetryData>(this.snapshot);

  constructor() {
    interval(80).subscribe(() => this.tick(80));
  }

  getTelemetryData(): Observable<TelemetryData> {
    return this.subject.asObservable();
  }

  getSnapshot(): TelemetryData {
    return this.snapshot;
  }

  private tick(dtMs: number): void {
    const s = this.sim;
    s.phaseMs += dtMs;
    s.lapMs += dtMs;
    if (s.lapMs > 86000) { s.lapMs = 0; s.fuel = Math.max(0, s.fuel - 1.8); }

    // Advance phase
    if (s.phaseMs >= this.PHASES[s.phase]) {
      s.phase = this.NEXT_PHASE[s.phase];
      s.phaseMs = 0;
    }

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const dt = Math.min(1, dtMs / 400);
    const noise = () => (Math.random() - 0.5) * 0.05;

    switch (s.phase) {
      case 'straight':
        s.throttle = lerp(s.throttle, 95 + noise() * 20, dt);
        s.brake    = lerp(s.brake, 0, dt * 3);
        s.speed    = lerp(s.speed, 310 + noise() * 30, dt * 0.3);
        s.rpm      = lerp(s.rpm, 13500 + noise() * 500, dt * 0.4);
        s.gear     = s.speed > 280 ? 8 : s.speed > 240 ? 7 : 6;
        s.drs      = true;
        break;
      case 'braking':
        s.throttle = lerp(s.throttle, 0, dt * 2);
        s.brake    = lerp(s.brake, 95 + noise() * 10, dt * 1.5);
        s.speed    = lerp(s.speed, 80 + noise() * 20, dt * 0.5);
        s.rpm      = lerp(s.rpm, 6000 + noise() * 300, dt * 0.6);
        s.gear     = s.speed > 150 ? 5 : s.speed > 100 ? 3 : 2;
        s.drs      = false;
        break;
      case 'corner':
        s.throttle = lerp(s.throttle, 30 + noise() * 20, dt);
        s.brake    = lerp(s.brake, 10 + noise() * 10, dt);
        s.speed    = lerp(s.speed, 100 + noise() * 20, dt * 0.3);
        s.rpm      = lerp(s.rpm, 7500 + noise() * 400, dt * 0.4);
        s.gear     = 2;
        s.drs      = false;
        break;
      case 'accel':
        s.throttle = lerp(s.throttle, 100, dt * 1.2);
        s.brake    = lerp(s.brake, 0, dt * 4);
        s.speed    = lerp(s.speed, 260 + noise() * 30, dt * 0.35);
        s.rpm      = lerp(s.rpm, 12000 + noise() * 500, dt * 0.5);
        s.gear     = s.speed > 200 ? 6 : s.speed > 150 ? 5 : s.speed > 100 ? 4 : 3;
        s.drs      = false;
        break;
    }

    // Clamp
    s.throttle = Math.max(0, Math.min(100, s.throttle));
    s.brake    = Math.max(0, Math.min(100, s.brake));
    s.speed    = Math.max(0, s.speed);
    s.rpm      = Math.max(800, Math.min(15000, s.rpm));

    this.snapshot = this.buildSnapshot();
    this.subject.next(this.snapshot);
  }

  private buildSnapshot(): TelemetryData {
    const s = this.sim;
    const ms = s.lapMs;
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    const millis = ms % 1000;
    return {
      speed:     Math.round(s.speed),
      rpm:       Math.round(s.rpm),
      throttle:  Math.round(s.throttle),
      brake:     Math.round(s.brake),
      gear:      s.gear,
      drs:       s.drs,
      lapTime:   `${mins}:${String(secs).padStart(2, '0')}.${String(millis).padStart(3, '0')}`,
      trackTemp: Math.round(s.trackTemp),
      carTemp:   Math.round(s.carTemp),
      fuel:      Math.round(s.fuel * 10) / 10
    };
  }
}

