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

@Injectable({
  providedIn: 'root'
})
export class TelemetryService {
  private telemetrySubject = new BehaviorSubject<TelemetryData>(this.getMockData());
  
  constructor() {
    this.initializeMockData();
  }

  getTelemetryData(): Observable<TelemetryData> {
    return this.telemetrySubject.asObservable();
  }

  private initializeMockData(): void {
    // Simulate telemetry data updates every 100ms
    interval(100).subscribe(() => {
      this.telemetrySubject.next(this.getMockData());
    });
  }

  private getMockData(): TelemetryData {
    const now = new Date();
    const minutes = Math.floor(Math.random() * 2);
    const seconds = Math.floor(Math.random() * 60);
    const milliseconds = Math.floor(Math.random() * 1000);

    return {
      speed: Math.random() > 0.5 ? Math.floor(Math.random() * 350) : 0,
      rpm: Math.floor(Math.random() * 15000),
      throttle: Math.random() * 100,
      brake: Math.random() > 0.7 ? Math.random() * 100 : 0,
      gear: Math.floor(Math.random() * 8),
      drs: Math.random() > 0.7,
      lapTime: `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(3, '0')}`,
      trackTemp: 30 + Math.random() * 40,
      carTemp: 60 + Math.random() * 80,
      fuel: Math.max(0, 100 - (Math.random() * 5))
    };
  }

  // TODO: Replace getMockData() with real API calls when connected to telemetry API/WebSocket
  // Example implementation:
  // connectToWebSocket(wsUrl: string): void {
  //   const ws = new WebSocket(wsUrl);
  //   ws.onmessage = (event) => {
  //     const data = JSON.parse(event.data);
  //     this.telemetrySubject.next(data);
  //   };
  // }
}
