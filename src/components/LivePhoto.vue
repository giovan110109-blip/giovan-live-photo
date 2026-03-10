<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch, nextTick } from 'vue';
import type { LivePhotoProps, LivePhotoEmits } from '../types';
import { isMobileDevice, vibrate } from '../core/player';
import { decodeThumbHash } from '../core/thumbhash';
import LivePhotoMute from './LivePhotoMute.vue';
import LivePhotoIndicator from './LivePhotoIndicator.vue';

const props = withDefaults(defineProps<LivePhotoProps>(), {
  autoPlay: false,
  loop: false,
  muted: true,
  volume: 1,
  playbackRate: 1,
  triggerMode: 'longpress',
  longPressDelay: 200,
  aspectRatio: 1,
  showIndicator: true,
  showMuteButton: true,
});

const emit = defineEmits<LivePhotoEmits>();

const videoRef = ref<HTMLVideoElement | null>(null);
const imageRef = ref<HTMLImageElement | null>(null);

const isPlaying = ref(false);
const isMuted = ref(props.muted);
const imageLoaded = ref(false);
const videoLoaded = ref(false);
const videoLoading = ref(false);
const progress = ref(0);
const duration = ref(0);
const currentTime = ref(0);

const isTouching = ref(false);
const isHovering = ref(false);
const longPressTimer = ref<number | null>(null);
let isPlayingNow = false;

const isMobile = computed(() => isMobileDevice());

const isReady = computed(() => imageLoaded.value && videoLoaded.value);

const isLoading = computed(() => !imageLoaded.value || videoLoading.value);

const placeholderUrl = computed(() => {
  if (props.thumbHash) {
    return decodeThumbHash(props.thumbHash);
  }
  if (props.thumbHashUrl) {
    return props.thumbHashUrl;
  }
  return null;
});

const showPlaceholder = computed(() => !imageLoaded.value && placeholderUrl.value);

const onImageLoad = () => {
  imageLoaded.value = true;
};

const onImageError = (e: Event) => {
  console.error('Image load error:', e);
  emit('error', new Error('Failed to load image'));
};

const onVideoCanPlay = () => {
  videoLoaded.value = true;
  videoLoading.value = false;
  if (imageLoaded.value) {
    emit('loaded');
  }
};

const onVideoLoadedMetadata = () => {
  if (videoRef.value) {
    duration.value = videoRef.value.duration;
  }
  videoLoaded.value = true;
  videoLoading.value = false;
};

const onVideoWaiting = () => {
  videoLoading.value = true;
};

const onVideoPlaying = () => {
  videoLoading.value = false;
};

const onVideoTimeUpdate = () => {
  if (!videoRef.value || !isPlaying.value) return;

  currentTime.value = videoRef.value.currentTime;
  duration.value = videoRef.value.duration;
  
  if (duration.value > 0) {
    progress.value = currentTime.value / duration.value;
    emit('progress', progress.value);
  }

  const remaining = duration.value - currentTime.value;
  if (remaining < 0.5 && remaining > 0) {
    isPlaying.value = false;
  }
};

const onVideoError = (e: Event) => {
  console.error('Video load error:', e);
  videoLoaded.value = false;
  videoLoading.value = false;
  isPlaying.value = false;
  isPlayingNow = false;
  emit('error', new Error('Failed to load video'));
};

const playVideo = async () => {
  if (!videoRef.value) {
    isPlayingNow = false;
    return;
  }

  if (!videoLoaded.value) {
    videoLoading.value = true;
    try {
      videoRef.value.load();
    } catch {
      // ignore
    }

    return new Promise<void>((resolve) => {
      const handler = () => {
        videoRef.value?.removeEventListener('loadedmetadata', handler);
        videoLoaded.value = true;
        videoLoading.value = false;
        playVideo().then(resolve);
      };

      const timeout = setTimeout(() => {
        videoRef.value?.removeEventListener('loadedmetadata', handler);
        videoLoading.value = false;
        isPlayingNow = false;
        resolve();
      }, 5000);

      videoRef.value?.addEventListener('loadedmetadata', () => {
        clearTimeout(timeout);
        handler();
      });
    });
  }

  try {
    videoRef.value.currentTime = 0;
    isPlaying.value = true;
    videoRef.value.muted = isMuted.value;
    videoRef.value.volume = props.volume;
    videoRef.value.playbackRate = props.playbackRate;
    videoRef.value.playsInline = true;

    const playPromise = videoRef.value.play();
    if (playPromise !== undefined) {
      await playPromise;
    }
    emit('play');
  } catch (error: any) {
    if (error.name === 'AbortError') {
      return;
    }
    console.error('Play failed:', error);
    isPlaying.value = false;
    isPlayingNow = false;
    emit('error', error);
  }
};

const stopVideo = () => {
  if (!videoRef.value) return;

  try {
    if (!videoRef.value.paused) {
      videoRef.value.pause();
    }
    setTimeout(() => {
      if (videoRef.value) {
        videoRef.value.currentTime = 0;
      }
    }, 300);
  } catch (error) {
    console.error('Stop video error:', error);
  }

  isPlaying.value = false;
  isPlayingNow = false;
  emit('pause');
};

const handleVideoEnded = () => {
  if (videoRef.value) {
    videoRef.value.currentTime = 0;
  }

  if (isMobile.value) {
    vibrate(30);
  }

  isPlaying.value = false;
  isPlayingNow = false;
  emit('ended');

  if (props.loop) {
    nextTick(() => {
      playVideo();
    });
  }
};

const handleMouseEnter = async () => {
  if (isMobile.value || props.triggerMode !== 'hover') return;
  if (isHovering.value) return;
  if (!imageLoaded.value) return;

  isHovering.value = true;

  if (videoLoaded.value) {
    isPlayingNow = true;
    await playVideo();
  } else {
    videoLoading.value = true;
    videoRef.value?.load();
  }
};

const handleMouseLeave = () => {
  if (isMobile.value) return;

  isHovering.value = false;
  videoLoading.value = false;

  if (isPlaying.value) {
    isPlayingNow = false;
    stopVideo();
  }
};

const handleTouchStart = (event: TouchEvent) => {
  if (!isMobile.value || props.triggerMode !== 'longpress') return;
  if (isPlayingNow) return;
  if (!imageLoaded.value) return;

  if (event.touches.length === 1) {
    const touch = event.touches[0];
    if (touch) {
      isTouching.value = true;

      longPressTimer.value = window.setTimeout(() => {
        if (isTouching.value && !isPlayingNow && imageLoaded.value) {
          if (videoLoaded.value) {
            isPlayingNow = true;
            playVideo();
            vibrate(50);
          } else {
            videoLoading.value = true;
            videoRef.value?.load();
          }
        }
      }, props.longPressDelay);
    }
  }
};

const handleTouchEnd = () => {
  if (!isMobile.value) return;

  isTouching.value = false;
  videoLoading.value = false;

  if (longPressTimer.value !== null) {
    clearTimeout(longPressTimer.value);
    longPressTimer.value = null;
  }

  if (isPlaying.value) {
    stopVideo();
    vibrate(25);
  }
};

const handleClick = (event: MouseEvent) => {
  if (isMobile.value && (isPlaying.value || isTouching.value)) {
    event.preventDefault();
    event.stopPropagation();
    return;
  }

  if (!isMobile.value && props.triggerMode === 'click') {
    if (!imageLoaded.value) return;
    
    if (isPlaying.value) {
      stopVideo();
    } else if (videoLoaded.value) {
      isPlayingNow = true;
      playVideo();
    } else {
      videoLoading.value = true;
      videoRef.value?.load();
    }
    return;
  }

  emit('click', event);
};

const handleMutedChange = (muted: boolean) => {
  isMuted.value = muted;
  if (videoRef.value) {
    videoRef.value.muted = muted;
  }
  emit('update:muted', muted);
};

watch(() => props.muted, (newVal) => {
  isMuted.value = newVal;
  if (videoRef.value) {
    videoRef.value.muted = newVal;
  }
});

watch(() => props.volume, (newVal) => {
  if (videoRef.value) {
    videoRef.value.volume = newVal;
  }
});

watch(() => props.playbackRate, (newVal) => {
  if (videoRef.value) {
    videoRef.value.playbackRate = newVal;
  }
});

onUnmounted(() => {
  if (longPressTimer.value !== null) {
    clearTimeout(longPressTimer.value);
  }
});

defineExpose({
  play: playVideo,
  pause: stopVideo,
  stop: stopVideo,
  getState: () => ({
    isPlaying: isPlaying.value,
    isMuted: isMuted.value,
    isLoading: isLoading.value,
    isLoaded: isReady.value,
    progress: progress.value,
    duration: duration.value,
    currentTime: currentTime.value,
  }),
});
</script>

<template>
  <div
    class="live-photo"
    :class="{
      'live-photo--loading': isLoading,
      'live-photo--ready': isReady,
    }"
    :style="{ aspectRatio: aspectRatio }"
    @click="handleClick"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @touchstart="handleTouchStart"
    @touchend="handleTouchEnd"
  >
    <div
      class="live-photo__image-layer"
      :class="{ 'live-photo__image-layer--hidden': isPlaying }"
    >
      <img
        v-if="showPlaceholder"
        :src="placeholderUrl!"
        class="live-photo__placeholder"
        alt=""
      />
      <img
        ref="imageRef"
        :src="imageUrl"
        :alt="posterUrl || 'Live Photo'"
        class="live-photo__image"
        :class="{ 'live-photo__image--hidden': showPlaceholder && !imageLoaded }"
        @load="onImageLoad"
        @error="onImageError"
      />
      <div v-if="!imageLoaded && !placeholderUrl" class="live-photo__image-placeholder" />
    </div>

    <video
      ref="videoRef"
      class="live-photo__video"
      :class="{ 'live-photo__video--visible': isPlaying }"
      :src="videoUrl"
      :muted="isMuted"
      :loop="loop"
      playsinline
      webkit-playsinline
      preload="metadata"
      @canplay="onVideoCanPlay"
      @loadedmetadata="onVideoLoadedMetadata"
      @waiting="onVideoWaiting"
      @playing="onVideoPlaying"
      @timeupdate="onVideoTimeUpdate"
      @ended="handleVideoEnded"
      @error="onVideoError"
    />

    <div class="live-photo__overlay" />

    <LivePhotoIndicator
      v-if="showIndicator && videoUrl"
      :is-playing="isPlaying"
      :can-play="videoLoaded"
      :is-loading="videoLoading"
    />

    <LivePhotoMute
      v-if="showMuteButton"
      :model-value="isMuted"
      @update:model-value="handleMutedChange"
    />

    <slot name="controls" :is-playing="isPlaying" :is-muted="isMuted" />
  </div>
</template>

<style scoped>
.live-photo {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: var(--live-photo-radius, 12px);
  user-select: none;
  cursor: pointer;
  background: #f0f0f0;
}

.live-photo--loading {
  cursor: wait;
}

.live-photo__image-layer {
  position: absolute;
  inset: 0;
  transition: opacity 0.3s ease-out;
}

.live-photo__image-layer--hidden {
  opacity: 0;
  pointer-events: none;
}

.live-photo__placeholder {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(10px);
  transform: scale(1.1);
}

.live-photo__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s ease-out;
}

.live-photo__image--hidden {
  opacity: 0;
}

.live-photo__image-placeholder {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 50%, #e0e0e0 100%);
  background-size: 200% 200%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.live-photo__video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.3s ease-out;
  pointer-events: none;
}

.live-photo__video--visible {
  opacity: 1;
}

.live-photo__overlay {
  position: absolute;
  inset: 0;
  background: transparent;
  transition: background-color 0.3s ease;
  pointer-events: none;
}

.live-photo:hover .live-photo__overlay {
  background: rgba(0, 0, 0, 0.1);
}

video::-webkit-media-controls,
video::-webkit-media-controls-enclosure,
video::-webkit-media-controls-panel,
video::-webkit-media-controls-overlay-play-button,
video::-webkit-media-controls-play-button {
  display: none !important;
}
</style>
