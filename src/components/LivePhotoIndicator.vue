<script setup lang="ts">
defineProps<{
  isPlaying: boolean;
  canPlay: boolean;
  isLoading?: boolean;
}>();
</script>

<template>
  <div
    class="live-photo-indicator"
    :class="{
      'live-photo-indicator--playing': isPlaying,
      'live-photo-indicator--loading': isLoading || !canPlay,
    }"
  >
    <svg
      v-if="isLoading || !canPlay"
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="live-photo-indicator__icon live-photo-indicator__icon--loading"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M11 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
      <path d="M7 12a5 5 0 1 0 10 0a5 5 0 1 0 -10 0" />
      <path d="M15.9 20.11l0 .01" />
      <path d="M19.04 17.61l0 .01" />
      <path d="M20.77 14l0 .01" />
      <path d="M20.77 10l0 .01" />
      <path d="M19.04 6.39l0 .01" />
      <path d="M15.9 3.89l0 .01" />
      <path d="M12 3l0 .01" />
      <path d="M8.1 3.89l0 .01" />
      <path d="M4.96 6.39l0 .01" />
      <path d="M3.23 10l0 .01" />
      <path d="M3.23 14l0 .01" />
      <path d="M4.96 17.61l0 .01" />
      <path d="M8.1 20.11l0 .01" />
      <path d="M12 21l0 .01" />
    </svg>
    <svg
      v-else
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="live-photo-indicator__icon"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M11 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
      <path d="M7 12a5 5 0 1 0 10 0a5 5 0 1 0 -10 0" />
      <path d="M15.9 20.11l0 .01" />
      <path d="M19.04 17.61l0 .01" />
      <path d="M20.77 14l0 .01" />
      <path d="M20.77 10l0 .01" />
      <path d="M19.04 6.39l0 .01" />
      <path d="M15.9 3.89l0 .01" />
      <path d="M12 3l0 .01" />
      <path d="M8.1 3.89l0 .01" />
      <path d="M4.96 6.39l0 .01" />
      <path d="M3.23 10l0 .01" />
      <path d="M3.23 14l0 .01" />
      <path d="M4.96 17.61l0 .01" />
      <path d="M8.1 20.11l0 .01" />
      <path d="M12 21l0 .01" />
    </svg>
    <span class="live-photo-indicator__text">LIVE</span>
  </div>
</template>

<style scoped>
.live-photo-indicator {
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 4px 6px;
  border-radius: 9999px;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(12px);
  color: white;
  font-size: 13px;
  font-weight: 700;
  user-select: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.live-photo-indicator--playing {
  background: rgba(250, 204, 21, 0.1);
  color: rgb(250, 204, 21);
  transform: scale(1.06);
}

.live-photo-indicator--loading {
  opacity: 0.8;
}

.live-photo-indicator__icon {
  transition: transform 0.3s ease;
}

.live-photo-indicator__icon--loading {
  animation: live-photo-spin 1s linear infinite;
}

.live-photo-indicator__text {
  line-height: 1;
}

@keyframes live-photo-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
