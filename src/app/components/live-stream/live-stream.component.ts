import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-live-stream',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './live-stream.component.html',
  styleUrls: ['./live-stream.component.css']
})
export class LiveStreamComponent implements OnInit {
  streamUrl: string = '';
  isStreamActive: boolean = false;
  streamingPlatform: 'twitch' | 'youtube' | 'custom' = 'twitch';
  channelInput: string = '';

  ngOnInit(): void {
    this.loadStreamSettings();
  }

  setStream(platform: 'twitch' | 'youtube'): void {
    this.streamingPlatform = platform;
  }

  startStream(): void {
    if (this.channelInput.trim()) {
      this.generateStreamUrl();
      this.isStreamActive = true;
      this.saveStreamSettings();
    }
  }

  stopStream(): void {
    this.isStreamActive = false;
    this.streamUrl = '';
  }

  generateStreamUrl(): void {
    const channel = this.channelInput.trim();
    
    if (this.streamingPlatform === 'twitch') {
      this.streamUrl = `https://twitch.tv/embed?channel=${channel}&parent=${window.location.hostname}`;
    } else if (this.streamingPlatform === 'youtube') {
      this.streamUrl = `https://www.youtube.com/embed/${channel}?autoplay=1`;
    }
  }

  private saveStreamSettings(): void {
    sessionStorage.setItem('streamChannel', this.channelInput);
    sessionStorage.setItem('streamPlatform', this.streamingPlatform);
  }

  private loadStreamSettings(): void {
    const savedChannel = sessionStorage.getItem('streamChannel');
    const savedPlatform = sessionStorage.getItem('streamPlatform') as 'twitch' | 'youtube' | null;
    
    if (savedChannel) this.channelInput = savedChannel;
    if (savedPlatform) this.streamingPlatform = savedPlatform;
  }
}
