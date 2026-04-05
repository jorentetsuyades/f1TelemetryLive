import {
  Component, OnInit, OnDestroy, ChangeDetectionStrategy,
  ChangeDetectorRef, signal, output
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { F1_2026_DRIVERS } from '../../data/f1-2026-drivers';

export interface RaceDriver {
  position: number;
  number: number;
  abbreviation: string;
  fullName: string;
  team: string;
  teamColor: string;
  teamLogo: string;
  gapSeconds: number;
  lastLapMs: number;
  bestLapMs: number;
  hasFastestLap: boolean;
  isDnf: boolean;
  tyre: 'S' | 'M' | 'H' | 'I' | 'W';
  tyreAge: number;
  pits: number;
}

@Component({
  selector: 'app-race-standings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './race-standings.component.html',
  styleUrls: ['./race-standings.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RaceStandingsComponent implements OnInit, OnDestroy {
  drivers = signal<RaceDriver[]>([]);
  currentLap = signal(42);
  totalLaps = signal(57);
  leaderLapTime = signal('1:23.456');
  selectedDriverNumber = signal<number>(1);

  driverSelected = output<RaceDriver>();

  private destroy$ = new Subject<void>();
  private lapProgressMs = 42000; // start mid-lap

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.drivers.set(F1_2026_DRIVERS.map(d => ({ ...d })));

    // Tick leader current lap time every 100ms
    interval(100).pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.lapProgressMs += 100;
      if (this.lapProgressMs >= 85000) {
        this.lapProgressMs = 0;
        if (this.currentLap() < this.totalLaps()) {
          this.currentLap.update(l => l + 1);
        }
      }
      const ms = this.lapProgressMs;
      const mins = Math.floor(ms / 60000);
      const secs = Math.floor((ms % 60000) / 1000);
      const millis = ms % 1000;
      this.leaderLapTime.set(
        `${mins}:${String(secs).padStart(2, '0')}.${String(millis).padStart(3, '0')}`
      );
      this.cdr.markForCheck();
    });

    // Simulate gap changes every 4 seconds
    interval(4000).pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.simulateGapChanges();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private simulateGapChanges(): void {
    const current = this.drivers();
    const updated = current.map((driver, i) => {
      if (driver.position === 1) return { ...driver, tyreAge: driver.tyreAge + 1 };
      const delta = (Math.random() - 0.48) * 0.25;
      return {
        ...driver,
        gapSeconds: Math.max(
          i > 0 ? current[i - 1].gapSeconds + 0.5 : 0.5,
          driver.gapSeconds + delta
        ),
        tyreAge: driver.tyreAge + 1
      };
    });
    this.drivers.set(updated);
    this.cdr.markForCheck();
  }

  selectDriver(driver: RaceDriver): void {
    this.selectedDriverNumber.set(driver.number);
    this.driverSelected.emit(driver);
  }

  formatGap(driver: RaceDriver): string {
    if (driver.position === 1) return this.leaderLapTime();
    const laps = Math.floor(driver.gapSeconds / 85);
    if (laps >= 1) return `+${laps} LAP`;
    return `+${driver.gapSeconds.toFixed(3)}`;
  }

  getTyreColor(tyre: string): string {
    const colors: Record<string, string> = {
      S: '#FF3333',
      M: '#FFF200',
      H: '#EBEBEB',
      I: '#39B54A',
      W: '#0067FF'
    };
    return colors[tyre] ?? '#FFFFFF';
  }

  isInDrsWindow(driver: RaceDriver, index: number): boolean {
    if (index === 0) return false;
    const prev = this.drivers()[index - 1];
    return driver.gapSeconds - prev.gapSeconds <= 1.0;
  }

  getPositionClass(pos: number): string {
    if (pos === 1) return 'pos-first';
    if (pos === 2) return 'pos-second';
    if (pos === 3) return 'pos-third';
    return '';
  }
}
