# F1 Live Telemetry Web Application

A modern Angular web application featuring real-time Formula 1 telemetry display and live streaming capabilities.

## Features

- **Real-time F1 Telemetry Display**: Live telemetry data visualization including:
  - Vehicle speed and RPM gauges
  - Throttle and brake inputs
  - Current gear and DRS status
  - Lap times and temperatures
  - Fuel consumption monitoring

- **Live Stream Integration**: Support for multiple streaming platforms:
  - Twitch integration
  - YouTube integration
  - Custom streaming channel configuration
  - 16:9 aspect ratio display

## Tech Stack

- **Framework**: Angular 18+
- **Language**: TypeScript 5+
- **Styling**: CSS with Tailwind utilities
- **State Management**: RxJS Observables
- **Component Architecture**: Standalone components with Angular signals

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── telemetry/          # F1 telemetry display component
│   │   │   ├── telemetry.component.ts
│   │   │   ├── telemetry.component.html
│   │   │   └── telemetry.component.css
│   │   └── live-stream/         # Live streaming component
│   │       ├── live-stream.component.ts
│   │       ├── live-stream.component.html
│   │       └── live-stream.component.css
│   ├── services/
│   │   └── telemetry.service.ts # Telemetry data service
│   ├── app.ts                   # Root component
│   └── app.html                 # Root template
└── main.ts                      # Application entry point
```

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation

1. Navigate to the project directory:
   ```bash
   cd "F1 Live with Telemetry web"
   ```

2. Dependencies are already installed.

## Development

### Run Development Server

```bash
npm start
```

The application will be available at `http://localhost:4200/`

### Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Configuration

### Adding Telemetry Data

The telemetry service currently uses mock data. To connect real telemetry:

1. Open `src/app/services/telemetry.service.ts`
2. Replace the `getMockData()` method with your API integration
3. Uncomment and implement the `connectToWebSocket()` method if using WebSocket

### Configuring Live Stream

1. Open the application
2. Select your streaming platform (Twitch or YouTube)
3. Enter your channel name or video ID
4. Click "Start Stream"

## Data Format

The telemetry service expects data in this format:

```typescript
interface TelemetryData {
  speed: number;           // km/h
  rpm: number;             // RPM value
  throttle: number;        // 0-100%
  brake: number;           // 0-100%
  gear: number;            // Current gear (0-8)
  drs: boolean;            // DRS active status
  lapTime: string;         // MM:SS.mmm format
  trackTemp: number;       // Celsius
  carTemp: number;         // Celsius
  fuel: number;            // Remaining fuel %
}
```

## Future Enhancements

- [ ] Real telemetry API integration
- [ ] Historical data analysis
- [ ] Comparison tools (current lap vs best lap)
- [ ] Multiple driver tracking
- [ ] Advanced data visualization (plots, graphs)
- [ ] Recording and playback capabilities

## License

This project is part of the F1 Live Telemetry suite.

## Support

For issues or feature requests, refer to the project documentation.
