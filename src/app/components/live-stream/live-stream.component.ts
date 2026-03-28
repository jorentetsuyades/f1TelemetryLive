import { Component, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShakaPlayerComponent } from '../shaka-player/shaka-player.component';
import { Channel } from '../../services/shaka-player.service';

@Component({
  selector: 'app-live-stream',
  standalone: true,
  imports: [CommonModule, ShakaPlayerComponent],
  templateUrl: './live-stream.component.html',
  styleUrls: ['./live-stream.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LiveStreamComponent implements OnInit {
  channelData = signal<Channel | null>(null);
  errorMessage = signal<string | null>(null);
  availableChannels = signal<Channel[]>([]);

  ngOnInit(): void {
    this.initializeChannels();
  }

  initializeChannels(): void {
    const channels: Channel[] = [
      {
        name: 'BeIN Sports',
        streamUrl: '/proxy-stream/api/beIN-Sports-1/index.m3u8',
        category: 'Sports'
      }
    ];

    this.availableChannels.set(channels);
    this.loadChannelData(channels[0]);
  }

  loadChannelData(channel: Channel): void {
    this.channelData.set(channel);
  }
}
