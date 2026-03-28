<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## F1 Live Telemetry & Stream Project

This is an Angular application featuring F1 telemetry display and live streaming capabilities.

### Project Stack
- Angular 18+
- TypeScript 5+
- RxJS for reactive streams
- CSS for styling with modern design

### Key Components
- **TelemetryComponent**: Displays real-time F1 vehicle telemetry data
  - Speed, RPM, throttle, brake gauges
  - Gear, DRS status, lap time
  - Temperature and fuel monitoring
  
- **LiveStreamComponent**: Live stream integration
  - Twitch support
  - YouTube support
  - Configurable channel input
  - 16:9 aspect ratio display

### Services
- **TelemetryService**: Manages telemetry data streams
  - Currently uses mock data for development
  - Ready for API/WebSocket integration

### Development Setup
1. Run `npm start` to start the development server (runs on http://localhost:4200)
2. Build with `npm run build`
3. Project structure: Components in `src/app/components/`, services in `src/app/services/`

### Next Steps
- Connect to real telemetry API/WebSocket
- User will provide streaming channel details for livestream configuration
- Consider adding more telemetry data visualization options
- Implement data recording and playback features

