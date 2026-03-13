export type TriggerMode = 'longpress' | 'click' | 'hover';

export interface LivePhotoSource {
  imageUrl: string;
  videoUrl: string;
  posterUrl?: string;
}

export interface LivePhotoOptions {
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  volume?: number;
  playbackRate?: number;
  triggerMode?: TriggerMode;
  longPressDelay?: number;
}

export interface LivePhotoState {
  isPlaying: boolean;
  isMuted: boolean;
  isLoading: boolean;
  isLoaded: boolean;
  progress: number;
  duration: number;
  currentTime: number;
}

export interface LivePhotoProps {
  imageUrl: string;
  videoUrl: string;
  posterUrl?: string;
  thumbHash?: string;
  thumbHashUrl?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  volume?: number;
  playbackRate?: number;
  triggerMode?: TriggerMode;
  longPressDelay?: number;
  aspectRatio?: number;
  showIndicator?: boolean;
  showMuteButton?: boolean;
  preloadVideo?: boolean;
}

export interface LivePhotoEmits {
  (e: 'play'): void;
  (e: 'pause'): void;
  (e: 'ended'): void;
  (e: 'loaded'): void;
  (e: 'error', error: Error): void;
  (e: 'progress', progress: number): void;
  (e: 'update:muted', muted: boolean): void;
  (e: 'click', event: MouseEvent): void;
}

export enum LivePhotoErrorCode {
  IMAGE_LOAD_ERROR = 'IMAGE_LOAD_ERROR',
  VIDEO_LOAD_ERROR = 'VIDEO_LOAD_ERROR',
  VIDEO_PLAY_ERROR = 'VIDEO_PLAY_ERROR',
  UNSUPPORTED_FORMAT = 'UNSUPPORTED_FORMAT',
  INVALID_URL = 'INVALID_URL',
}

export class LivePhotoError extends Error {
  code: LivePhotoErrorCode;
  source?: string;

  constructor(code: LivePhotoErrorCode, message: string, source?: string) {
    super(message);
    this.name = 'LivePhotoError';
    this.code = code;
    this.source = source;
  }
}
