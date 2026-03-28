import { Injectable } from '@angular/core';
import { signal } from '@angular/core';
import * as shaka from 'shaka-player';

export interface Channel {
  name: string;
  streamUrl: string;
  category?: string;
  logo?: string;
  logoLocal?: string;
  headers?: Record<string, string>;
  drm?: Record<string, any>;
}

export interface ShakaPlayerConfig {
  drmServers?: Record<string, string>;
  customHeaders?: Record<string, string>;
}

@Injectable({
  providedIn: 'root'
})
export class ShakaPlayerService {
  private player: any = null;
  private videoElement: HTMLVideoElement | null = null;

  isInitialized = signal(false);
  isPlaying = signal(false);
  currentChannel = signal<Channel | null>(null);
  error = signal<string | null>(null);

  constructor() {
    this.initializeShaka();
  }

  private initializeShaka(): void {
    try {
      (shaka as any).polyfill.installAll();

      if ((shaka as any).Player.isBrowserSupported()) {
        this.isInitialized.set(true);
      } else {
        this.error.set('Shaka Player not supported in this browser');
      }
    } catch (err: any) {
      this.error.set(`Shaka initialization error: ${err.message}`);
    }
  }

  attachVideoElement(videoElement: HTMLVideoElement): void {
    if (!videoElement) {
      this.error.set('Invalid video element provided');
      return;
    }

    this.videoElement = videoElement;

    if (!this.isInitialized()) {
      this.error.set('Shaka Player not initialized yet');
      setTimeout(() => {
        if (this.isInitialized()) {
          this.attachVideoElement(videoElement);
        }
      }, 500);
      return;
    }

    try {
      if (this.player) {
        this.player.destroy();
      }

      this.player = new (shaka as any).Player(videoElement);

      this.player.addEventListener('error', (event: any) => {
        const error = event.detail;
        this.error.set(`Error ${error.code}: ${error.message || 'Playback error'}`);
        this.isPlaying.set(false);
      });

      this.player.addEventListener('playing', () => {
        this.isPlaying.set(true);
        this.error.set(null);
      });

      this.player.addEventListener('pause', () => {
        this.isPlaying.set(false);
      });

    } catch (err: any) {
      this.error.set(`Failed to initialize player: ${err.message}`);
    }
  }

  async loadStream(channel: Channel, config?: ShakaPlayerConfig): Promise<void> {
    if (!this.videoElement) {
      this.error.set('Video element not available - player not attached');
      return;
    }

    if (!this.player) {
      this.error.set('Player not created - call attachVideoElement first');
      return;
    }

    try {
      this.error.set(null);
      this.currentChannel.set(channel);

      if (!this.videoElement.parentElement) {
        throw new Error('Video element not in DOM');
      }

      if (config?.drmServers) {
        this.player.configure({
          drm: {
            servers: config.drmServers,
            advanced: {
              'org.w3.clearkey': {
                videoRobustness: '',
                audioRobustness: ''
              }
            }
          }
        });
      }

      if (config?.customHeaders || channel.headers) {
        this.player.getNetworkingEngine().clearAllRequestFilters();
        const headers = { ...config?.customHeaders, ...channel.headers };

        this.player.getNetworkingEngine().registerRequestFilter((_type: any, request: any) => {
          Object.entries(headers).forEach(([key, value]) => {
            if (key.toLowerCase() !== 'user-agent') {
              request.headers[key] = value;
            }
          });
        });
      }

      try {
        await this.player.unload();
      } catch (e) {
        // ignore unload errors
      }

      await this.player.load(channel.streamUrl);
      this.videoElement.play().catch(() => {});

    } catch (err: any) {
      this.error.set(`Stream load failed: ${err.message || 'Unknown error'}`);
      this.isPlaying.set(false);
    }
  }

  play(): void {
    if (this.videoElement) {
      this.videoElement.play().catch(err => {
        this.error.set('Playback failed: ' + err.message);
      });
    }
  }

  pause(): void {
    if (this.videoElement) {
      this.videoElement.pause();
    }
  }

  stop(): void {
    if (this.player) {
      this.player.unload().catch(() => {});
      this.isPlaying.set(false);
      this.currentChannel.set(null);
    }
  }

  setVolume(level: number): void {
    if (this.videoElement) {
      this.videoElement.volume = Math.max(0, Math.min(1, level));
    }
  }

  getVolume(): number {
    return this.videoElement?.volume ?? 0;
  }

  async requestFullscreen(): Promise<void> {
    if (this.videoElement?.requestFullscreen) {
      try {
        await this.videoElement.requestFullscreen();
      } catch (err) {
        console.warn('Fullscreen request failed', err);
      }
    }
  }

  async exitFullscreen(): Promise<void> {
    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch (err) {
        console.warn('Exit fullscreen failed', err);
      }
    }
  }

  destroy(): void {
    if (this.player) {
      this.player.destroy();
      this.player = null;
    }
    this.isPlaying.set(false);
    this.currentChannel.set(null);
  }
}
