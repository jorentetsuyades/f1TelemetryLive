import {
  Component, OnInit, OnDestroy, ChangeDetectionStrategy,
  ChangeDetectorRef, input, inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RaceDriver } from '../race-standings/race-standings.component';
import { F1_2026_DRIVERS } from '../../data/f1-2026-drivers';

// Miami International Autodrome – simplified centerline as normalized [0..1] path points
// The full lap is represented as a series of (x,y) control points on a 400×220 canvas
const MIAMI_PATH_POINTS: [number, number][] = [
  // Start/Finish straight
  [310, 55], [280, 52], [250, 51], [220, 51], [190, 52],
  // Turn 1–3 (wide right hander complex)
  [160, 55], [138, 65], [125, 82], [120, 100],
  // Turn 4-5 (chicane)
  [122, 118], [132, 130], [145, 134], [155, 128], [160, 118],
  // Turn 6-7 (back section)
  [165, 108], [178, 100], [195, 98], [215, 100],
  // Turn 8-9-10 (stadium section – tight hairpin)
  [235, 102], [252, 110], [258, 124], [252, 138],
  [238, 148], [220, 152], [200, 149],
  // Turn 11 (long right)
  [182, 144], [168, 135], [160, 120],
  // Turn 12-13-14-15 (infield technical section)
  [155, 108], [150, 95], [152, 82], [160, 72],
  [172, 64], [188, 58], [205, 54],
  // Back onto start/finish via Turn 16-17
  [230, 52], [260, 51], [285, 52], [310, 55],
];

// Pre-compute cumulative arc lengths for uniform speed parameterization
function buildLUT(pts: [number, number][]): { t: number; x: number; y: number }[] {
  const lut: { t: number; x: number; y: number }[] = [];
  let total = 0;
  const segs: number[] = [0];
  for (let i = 1; i < pts.length; i++) {
    const dx = pts[i][0] - pts[i - 1][0];
    const dy = pts[i][1] - pts[i - 1][1];
    total += Math.sqrt(dx * dx + dy * dy);
    segs.push(total);
  }
  for (let i = 0; i < pts.length; i++) {
    lut.push({ t: segs[i] / total, x: pts[i][0], y: pts[i][1] });
  }
  return lut;
}

const PATH_LUT = buildLUT(MIAMI_PATH_POINTS);

function getPointAtT(t: number): { x: number; y: number } {
  const wrapped = ((t % 1) + 1) % 1;
  for (let i = 1; i < PATH_LUT.length; i++) {
    if (PATH_LUT[i].t >= wrapped) {
      const prev = PATH_LUT[i - 1];
      const curr = PATH_LUT[i];
      const span = curr.t - prev.t;
      const local = span === 0 ? 0 : (wrapped - prev.t) / span;
      return {
        x: prev.x + (curr.x - prev.x) * local,
        y: prev.y + (curr.y - prev.y) * local,
      };
    }
  }
  return { x: PATH_LUT[PATH_LUT.length - 1].x, y: PATH_LUT[PATH_LUT.length - 1].y };
}

// Build the SVG polyline points string from path points
export const MIAMI_TRACK_D = MIAMI_PATH_POINTS.map(p => p.join(',')).join(' ');

export interface CarPosition {
  driver: RaceDriver;
  t: number; // 0..1 lap progress
  x: number;
  y: number;
}

@Component({
  selector: 'app-track-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './track-map.component.html',
  styleUrls: ['./track-map.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrackMapComponent implements OnInit, OnDestroy {
  drivers = input<RaceDriver[]>(F1_2026_DRIVERS.map(d => ({ ...d })) as RaceDriver[]);
  selectedDriverNumber = input<number | null>(null);

  carPositions: CarPosition[] = [];
  readonly trackPoints = MIAMI_TRACK_D;

  private destroy$ = new Subject<void>();
  private cdr = inject(ChangeDetectorRef);
  // Each driver gets a starting offset spread evenly around the track
  private offsets: Map<number, number> = new Map();

  ngOnInit(): void {
    // Spread drivers evenly on track based on their gap
    // Leader (gap=0) at t=0.98 (near start/finish), others behind
    this.initOffsets();

    // Animate at ~30fps
    interval(33).pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.tick();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initOffsets(): void {
    const driversArr = this.drivers();
    if (!driversArr.length) return;

    // Approximate lap length in seconds (~83s). Convert gap to fraction of lap.
    const lapSeconds = 83;
    driversArr.forEach(d => {
      const gapFraction = (d.gapSeconds % lapSeconds) / lapSeconds;
      // Leader starts near start/finish line (t≈0.98), followers behind
      const offset = (0.98 - gapFraction + 1) % 1;
      this.offsets.set(d.number, offset);
    });

    this.updatePositions();
  }

  private tick(): void {
    // Move each car forward by approximately 1 lap / 83s / 30fps
    const delta = 1 / (83 * 30);
    const driversArr = this.drivers();

    driversArr.forEach(d => {
      const current = this.offsets.get(d.number) ?? 0;
      this.offsets.set(d.number, (current + delta) % 1);
    });

    this.updatePositions();
    this.cdr.markForCheck();
  }

  private updatePositions(): void {
    const driversArr = this.drivers();
    this.carPositions = driversArr.map(d => {
      const t = this.offsets.get(d.number) ?? 0;
      const pos = getPointAtT(t);
      return { driver: d, t, x: pos.x, y: pos.y };
    });
  }

  isSelected(car: CarPosition): boolean {
    return car.driver.number === this.selectedDriverNumber();
  }
}
