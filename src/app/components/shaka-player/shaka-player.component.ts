import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy, ChangeDetectionStrategy, input, output, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShakaPlayerService, Channel, ShakaPlayerConfig } from '../../services/shaka-player.service';

@Component({
  selector: 'app-shaka-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shaka-player.component.html',
  styleUrls: ['./shaka-player.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShakaPlayerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('videoPlayer', { static: false }) videoPlayer!: ElementRef<HTMLVideoElement>;

  private shakaService = inject(ShakaPlayerService);

  channel = input<Channel | null>(null);
  playerConfig = input<ShakaPlayerConfig | undefined>();
  
  streamLoaded = output<void>();
  streamError = output<string>();

  isPlaying = this.shakaService.isPlaying;
  currentChannel = this.shakaService.currentChannel;
  error = this.shakaService.error;
  isInitialized = this.shakaService.isInitialized;

  constructor() {
    // Watch for channel changes and auto-load
    effect(() => {
      const newChannel = this.channel();
      if (newChannel && this.videoPlayer?.nativeElement?.parentElement) {
        this.loadStream(newChannel);
      }
    });
  }

  ngAfterViewInit(): void {
    const attachVideo = () => {
      const videoElement = this.videoPlayer?.nativeElement;

      if (!videoElement) {
        setTimeout(attachVideo, 100);
        return;
      }

      this.shakaService.attachVideoElement(videoElement);

      setTimeout(() => {
        const initialChannel = this.channel();
        if (initialChannel) {
          this.loadStream(initialChannel);
        }
      }, 200);
    };

    attachVideo();
  }

  async loadStream(streamChannel: Channel): Promise<void> {
    try {
      const config = this.playerConfig();
      await this.shakaService.loadStream(streamChannel, config);
      this.streamLoaded.emit();
    } catch (err: any) {
      this.streamError.emit(err.message || 'Failed to load stream');
    }
  }

  play(): void {
    this.shakaService.play();
  }

  pause(): void {
    this.shakaService.pause();
  }

  stop(): void {
    this.shakaService.stop();
  }

  async toggleFullscreen(): Promise<void> {
    if (document.fullscreenElement) {
      await this.shakaService.exitFullscreen();
    } else {
      await this.shakaService.requestFullscreen();
    }
  }

  ngOnDestroy(): void {
    this.shakaService.destroy();
  }
}
