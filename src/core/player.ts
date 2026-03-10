import type { LivePhotoOptions, LivePhotoState } from '../types';

export interface LivePhotoPlayer {
  play(): Promise<void>;
  pause(): void;
  stop(): void;
  setMuted(muted: boolean): void;
  setVolume(volume: number): void;
  setPlaybackRate(rate: number): void;
  getState(): LivePhotoState;
  destroy(): void;
}

export function createPlayerState(): LivePhotoState {
  return {
    isPlaying: false,
    isMuted: true,
    isLoading: true,
    isLoaded: false,
    progress: 0,
    duration: 0,
    currentTime: 0,
  };
}

export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

export function getDefaultOptions(): Required<LivePhotoOptions> {
  return {
    autoPlay: false,
    loop: false,
    muted: true,
    volume: 1,
    playbackRate: 1,
    triggerMode: 'longpress',
    longPressDelay: 200,
  };
}

export function vibrate(duration: number): void {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate(duration);
  }
}
