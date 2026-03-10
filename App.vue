<script setup lang="ts">
import { ref } from 'vue';
import { LivePhoto } from './src/index';

const isMuted = ref(true);

const demos = [
  {
    title: '悬停播放',
    triggerMode: 'hover',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
  },
  {
    title: '点击播放',
    triggerMode: 'click',
    imageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
  },
  {
    title: '长按播放',
    triggerMode: 'longpress',
    imageUrl: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
  },
];

const handlePlay = () => {
  console.log('视频开始播放');
};

const handlePause = () => {
  console.log('视频暂停');
};

const handleEnded = () => {
  console.log('视频播放结束');
};
</script>

<template>
  <div class="container">
    <h1>📸 Live Photo 测试</h1>

    <div class="demo-section">
      <h2>不同触发模式</h2>
      <div class="photo-grid">
        <div v-for="demo in demos" :key="demo.title" class="photo-card">
          <LivePhoto
            :image-url="demo.imageUrl"
            :video-url="demo.videoUrl"
            :trigger-mode="demo.triggerMode"
            :muted="isMuted"
            :aspect-ratio="4 / 3"
            @play="handlePlay"
            @pause="handlePause"
            @ended="handleEnded"
          />
          <div class="info">
            <strong>{{ demo.title }}</strong>
            <br />
            <code>trigger-mode="{{ demo.triggerMode }}"</code>
          </div>
        </div>
      </div>
    </div>

    <div class="demo-section">
      <h2>全局静音控制</h2>
      <div class="photo-card" style="padding: 20px;">
        <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
          <input type="checkbox" v-model="isMuted" />
          <span>静音: {{ isMuted ? '开启' : '关闭' }}</span>
        </label>
      </div>
    </div>
  </div>
</template>

<style>
@import './src/styles/index.css';
</style>
