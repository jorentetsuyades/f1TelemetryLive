import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TelemetryService } from '../../services/telemetry.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface TelemetryData {
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

@Component({
  selector: 'app-telemetry',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './telemetry.component.html',
  styleUrls: ['./telemetry.component.css']
})
export class TelemetryComponent implements OnInit, OnDestroy {
  telemetryData: TelemetryData = {
    speed: 0,
    rpm: 0,
    throttle: 0,
    brake: 0,
    gear: 0,
    drs: false,
    lapTime: '00:00.000',
    trackTemp: 0,
    carTemp: 0,
    fuel: 100
  };

  private destroy$ = new Subject<void>();

  constructor(private telemetryService: TelemetryService) {}

  ngOnInit(): void {
    this.telemetryService.getTelemetryData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.telemetryData = data;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getSpeedPercentage(): number {
    return (this.telemetryData.speed / 350) * 100;
  }

  getRpmPercentage(): number {
    return (this.telemetryData.rpm / 15000) * 100;
  }

  getThrottlePercentage(): number {
    return this.telemetryData.throttle;
  }

  getBrakePercentage(): number {
    return this.telemetryData.brake;
  }
}
