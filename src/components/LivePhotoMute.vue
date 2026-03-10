<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const isMuted = ref(props.modelValue);

const handleToggle = () => {
  isMuted.value = !isMuted.value;
  emit('update:modelValue', isMuted.value);
};

watch(() => props.modelValue, (newVal) => {
  isMuted.value = newVal;
});
</script>

<template>
  <button
    type="button"
    class="live-photo-mute"
    :class="{ 'live-photo-mute--muted': isMuted }"
    :title="isMuted ? '点击取消静音' : '点击静音'"
    @click.stop="handleToggle"
  >
    <svg
      v-if="!isMuted"
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="live-photo-mute__icon"
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
    <svg
      v-else
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="live-photo-mute__icon"
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  </button>
</template>

<style scoped>
.live-photo-mute {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(12px);
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}

.live-photo-mute:hover {
  background: rgba(0, 0, 0, 0.5);
}

.live-photo-mute:active {
  transform: scale(0.95);
}

.live-photo-mute--muted {
  color: rgba(255, 255, 255, 0.7);
}

.live-photo-mute__icon {
  transition: opacity 0.2s ease;
}
</style>
