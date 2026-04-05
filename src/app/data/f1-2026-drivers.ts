import { RaceDriver } from '../components/race-standings/race-standings.component';

export const F1_2026_DRIVERS: RaceDriver[] = [
  // McLaren Mastercard F1 Team
  { position: 1,  number: 1,  abbreviation: 'NOR', fullName: 'Lando Norris',         team: 'McLaren',      teamColor: '#FF8000', teamLogo: 'assets/teams/mclaren.png',     gapSeconds: 0,       lastLapMs: 83456, bestLapMs: 82891, hasFastestLap: true,  isDnf: false, tyre: 'H', tyreAge: 18, pits: 1 },
  { position: 2,  number: 81, abbreviation: 'PIA', fullName: 'Oscar Piastri',         team: 'McLaren',      teamColor: '#FF8000', teamLogo: 'assets/teams/mclaren.png',     gapSeconds: 1.892,   lastLapMs: 83612, bestLapMs: 83100, hasFastestLap: false, isDnf: false, tyre: 'H', tyreAge: 18, pits: 1 },

  // Mercedes-AMG Petronas F1 Team
  { position: 3,  number: 63, abbreviation: 'RUS', fullName: 'George Russell',        team: 'Mercedes',     teamColor: '#27F4D2', teamLogo: 'assets/teams/mercedes.png',    gapSeconds: 4.543,   lastLapMs: 83890, bestLapMs: 83250, hasFastestLap: false, isDnf: false, tyre: 'M', tyreAge: 8,  pits: 2 },
  { position: 4,  number: 12, abbreviation: 'ANT', fullName: 'Andrea Kimi Antonelli', team: 'Mercedes',     teamColor: '#27F4D2', teamLogo: 'assets/teams/mercedes.png',    gapSeconds: 7.812,   lastLapMs: 84102, bestLapMs: 83580, hasFastestLap: false, isDnf: false, tyre: 'M', tyreAge: 8,  pits: 2 },

  // Oracle Red Bull Racing
  { position: 5,  number: 3,  abbreviation: 'VER', fullName: 'Max Verstappen',        team: 'Red Bull',     teamColor: '#3671C6', teamLogo: 'assets/teams/redbull.png',     gapSeconds: 12.445,  lastLapMs: 83780, bestLapMs: 83410, hasFastestLap: false, isDnf: false, tyre: 'H', tyreAge: 15, pits: 1 },
  { position: 6,  number: 6,  abbreviation: 'HAD', fullName: 'Isack Hadjar',          team: 'Red Bull',     teamColor: '#3671C6', teamLogo: 'assets/teams/redbull.png',     gapSeconds: 17.334,  lastLapMs: 84234, bestLapMs: 83780, hasFastestLap: false, isDnf: false, tyre: 'H', tyreAge: 15, pits: 1 },

  // Scuderia Ferrari HP
  { position: 7,  number: 16, abbreviation: 'LEC', fullName: 'Charles Leclerc',       team: 'Ferrari',      teamColor: '#E8002D', teamLogo: 'assets/teams/ferrari.png',     gapSeconds: 22.891,  lastLapMs: 84456, bestLapMs: 83990, hasFastestLap: false, isDnf: false, tyre: 'M', tyreAge: 12, pits: 2 },
  { position: 8,  number: 44, abbreviation: 'HAM', fullName: 'Lewis Hamilton',        team: 'Ferrari',      teamColor: '#E8002D', teamLogo: 'assets/teams/ferrari.png',     gapSeconds: 28.103,  lastLapMs: 84678, bestLapMs: 84210, hasFastestLap: false, isDnf: false, tyre: 'M', tyreAge: 12, pits: 2 },

  // Aston Martin Aramco F1 Team
  { position: 9,  number: 14, abbreviation: 'ALO', fullName: 'Fernando Alonso',       team: 'Aston Martin', teamColor: '#229971', teamLogo: 'assets/teams/astonmartin.png', gapSeconds: 35.228,  lastLapMs: 85102, bestLapMs: 84456, hasFastestLap: false, isDnf: false, tyre: 'H', tyreAge: 22, pits: 1 },
  { position: 10, number: 18, abbreviation: 'STR', fullName: 'Lance Stroll',          team: 'Aston Martin', teamColor: '#229971', teamLogo: 'assets/teams/astonmartin.png', gapSeconds: 41.890,  lastLapMs: 85234, bestLapMs: 84678, hasFastestLap: false, isDnf: false, tyre: 'H', tyreAge: 22, pits: 1 },

  // Atlassian Williams F1 Team
  { position: 11, number: 23, abbreviation: 'ALB', fullName: 'Alex Albon',            team: 'Williams',     teamColor: '#64C4FF', teamLogo: 'assets/teams/williams.png',    gapSeconds: 47.334,  lastLapMs: 85456, bestLapMs: 84890, hasFastestLap: false, isDnf: false, tyre: 'M', tyreAge: 6,  pits: 2 },
  { position: 12, number: 55, abbreviation: 'SAI', fullName: 'Carlos Sainz Jr.',      team: 'Williams',     teamColor: '#64C4FF', teamLogo: 'assets/teams/williams.png',    gapSeconds: 52.891,  lastLapMs: 85678, bestLapMs: 85102, hasFastestLap: false, isDnf: false, tyre: 'M', tyreAge: 6,  pits: 2 },

  // BWT Alpine F1 Team
  { position: 13, number: 10, abbreviation: 'GAS', fullName: 'Pierre Gasly',          team: 'Alpine',       teamColor: '#0093CC', teamLogo: 'assets/teams/alpine.png',      gapSeconds: 59.112,  lastLapMs: 85890, bestLapMs: 85234, hasFastestLap: false, isDnf: false, tyre: 'H', tyreAge: 28, pits: 1 },
  { position: 14, number: 43, abbreviation: 'COL', fullName: 'Franco Colapinto',      team: 'Alpine',       teamColor: '#0093CC', teamLogo: 'assets/teams/alpine.png',      gapSeconds: 64.789,  lastLapMs: 86102, bestLapMs: 85456, hasFastestLap: false, isDnf: false, tyre: 'H', tyreAge: 28, pits: 1 },

  // TGR Haas F1 Team
  { position: 15, number: 31, abbreviation: 'OCO', fullName: 'Esteban Ocon',          team: 'Haas',         teamColor: '#B6BABD', teamLogo: 'assets/teams/haas.png',        gapSeconds: 71.445,  lastLapMs: 86234, bestLapMs: 85678, hasFastestLap: false, isDnf: false, tyre: 'M', tyreAge: 14, pits: 2 },
  { position: 16, number: 87, abbreviation: 'BEA', fullName: 'Oliver Bearman',        team: 'Haas',         teamColor: '#B6BABD', teamLogo: 'assets/teams/haas.png',        gapSeconds: 76.112,  lastLapMs: 86456, bestLapMs: 85890, hasFastestLap: false, isDnf: false, tyre: 'M', tyreAge: 14, pits: 2 },

  // Visa Cash App Racing Bulls
  { position: 17, number: 30, abbreviation: 'LAW', fullName: 'Liam Lawson',           team: 'Racing Bulls', teamColor: '#6692FF', teamLogo: 'assets/teams/racingbulls.png', gapSeconds: 82.234,  lastLapMs: 86678, bestLapMs: 86102, hasFastestLap: false, isDnf: false, tyre: 'H', tyreAge: 20, pits: 1 },
  { position: 18, number: 41, abbreviation: 'LIN', fullName: 'Arvid Lindblad',        team: 'Racing Bulls', teamColor: '#6692FF', teamLogo: 'assets/teams/racingbulls.png', gapSeconds: 87.891,  lastLapMs: 86890, bestLapMs: 86234, hasFastestLap: false, isDnf: false, tyre: 'H', tyreAge: 20, pits: 1 },

  // Audi Revolut F1 Team
  { position: 19, number: 27, abbreviation: 'HUL', fullName: 'Nico Hülkenberg',       team: 'Audi',         teamColor: '#C0C0C0', teamLogo: 'assets/teams/audi.png',        gapSeconds: 94.001,  lastLapMs: 87102, bestLapMs: 86456, hasFastestLap: false, isDnf: false, tyre: 'M', tyreAge: 5,  pits: 2 },
  { position: 20, number: 5,  abbreviation: 'BOR', fullName: 'Gabriel Bortoleto',     team: 'Audi',         teamColor: '#C0C0C0', teamLogo: 'assets/teams/audi.png',        gapSeconds: 99.567,  lastLapMs: 87234, bestLapMs: 86678, hasFastestLap: false, isDnf: false, tyre: 'M', tyreAge: 5,  pits: 2 },

  // Cadillac Formula 1 Team
  { position: 21, number: 77, abbreviation: 'BOT', fullName: 'Valtteri Bottas',       team: 'Cadillac',     teamColor: '#CC0000', teamLogo: 'assets/teams/cadillac.png',    gapSeconds: 107.234, lastLapMs: 87456, bestLapMs: 86890, hasFastestLap: false, isDnf: false, tyre: 'H', tyreAge: 32, pits: 1 },
  { position: 22, number: 11, abbreviation: 'PER', fullName: 'Sergio Pérez',          team: 'Cadillac',     teamColor: '#CC0000', teamLogo: 'assets/teams/cadillac.png',    gapSeconds: 113.890, lastLapMs: 87678, bestLapMs: 87102, hasFastestLap: false, isDnf: false, tyre: 'H', tyreAge: 32, pits: 1 },
];
