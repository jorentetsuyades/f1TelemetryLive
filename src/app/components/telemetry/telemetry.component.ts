import {
  Component, OnInit, OnDestroy, ChangeDetectionStrategy,
  ChangeDetectorRef, input, signal, inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TelemetryService } from '../../services/telemetry.service';
import { RaceDriver } from '../race-standings/race-standings.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-telemetry',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './telemetry.component.html',
  styleUrls: ['./telemetry.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TelemetryComponent implements OnInit, OnDestroy {
  private telemetryService = inject(TelemetryService);
  private cdr = inject(ChangeDetectorRef);

  selectedDriver = input<RaceDriver | null>(null);

  telemetryData = signal(this.telemetryService.getSnapshot());

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.telemetryService.getTelemetryData()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.telemetryData.set(data);
        this.cdr.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get speedPct()    { return Math.min(100, (this.telemetryData().speed    / 350)   * 100); }
  get rpmPct()      { return Math.min(100, (this.telemetryData().rpm      / 15000) * 100); }
  get throttlePct() { return this.telemetryData().throttle; }
  get brakePct()    { return this.telemetryData().brake; }
  get fuelPct()     { return this.telemetryData().fuel; }

  get rpmColor(): string {
    const pct = this.rpmPct;
    if (pct > 85) return '#ff3333';
    if (pct > 65) return '#ffd700';
    return '#00e676';
  }
}
