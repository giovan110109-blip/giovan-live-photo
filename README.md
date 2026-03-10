# giovan-live-photo

一个 Vue 3 Live Photo 播放器组件库，支持长按、悬停、点击三种触发模式。

## 特性

- 🎬 **多种触发模式** - 支持长按、悬停、点击三种播放触发方式
- 🔇 **静音控制** - 内置静音按钮，支持自定义静音状态
- 📱 **移动端优化** - 支持触摸长按播放，带触觉反馈
- 🖼️ **ThumbHash 支持** - 支持 ThumbHash 占位图，优化加载体验
- ⏳ **加载状态保护** - 图片/视频未加载完成时禁止播放
- 🎨 **自定义样式** - 通过 CSS 变量轻松定制外观
- 📦 **TypeScript** - 完整的类型支持
- ⚡ **轻量级** - 仅依赖 thumbhash

## 安装

```bash
npm install giovan-live-photo
# 或
yarn add giovan-live-photo
# 或
pnpm add giovan-live-photo
```

## 快速开始

```vue
<template>
  <LivePhoto
    image-url="https://example.com/photo.jpg"
    video-url="https://example.com/video.mov"
  />
</template>

<script setup>
import { LivePhoto } from 'giovan-live-photo';
import 'giovan-live-photo/style.css';
</script>
```

## 组件

### LivePhoto

主组件，用于展示和播放 Live Photo。

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `imageUrl` | `string` | - | 图片 URL（必填） |
| `videoUrl` | `string` | - | 视频 URL（必填） |
| `posterUrl` | `string` | - | 封面图 URL |
| `thumbHash` | `string` | - | ThumbHash base64 字符串，用于生成占位图 |
| `thumbHashUrl` | `string` | - | 占位图 URL（直接使用） |
| `autoPlay` | `boolean` | `false` | 自动播放 |
| `loop` | `boolean` | `false` | 循环播放 |
| `muted` | `boolean` | `true` | 静音状态 |
| `volume` | `number` | `1` | 音量 (0-1) |
| `playbackRate` | `number` | `1` | 播放速度 |
| `triggerMode` | `'longpress' \| 'click' \| 'hover'` | `'longpress'` | 触发模式 |
| `longPressDelay` | `number` | `200` | 长按延迟 (ms) |
| `aspectRatio` | `number` | `1` | 宽高比 |
| `showIndicator` | `boolean` | `true` | 显示 LIVE 指示器 |
| `showMuteButton` | `boolean` | `true` | 显示静音按钮 |

#### Events

| 事件 | 参数 | 说明 |
|------|------|------|
| `play` | - | 开始播放 |
| `pause` | - | 暂停播放 |
| `ended` | - | 播放结束 |
| `loaded` | - | 资源加载完成 |
| `error` | `Error` | 发生错误 |
| `progress` | `number` | 播放进度 (0-1) |
| `update:muted` | `boolean` | 静音状态变化 |
| `click` | `MouseEvent` | 点击事件 |

#### Slots

| 插槽 | 参数 | 说明 |
|------|------|------|
| `controls` | `{ isPlaying, isMuted }` | 自定义控制按钮 |

#### Methods

通过 `ref` 调用组件方法：

```vue
<template>
  <LivePhoto ref="livePhotoRef" ... />
</template>

<script setup>
import { ref } from 'vue';

const livePhotoRef = ref();

const play = () => {
  livePhotoRef.value?.play();
};

const pause = () => {
  livePhotoRef.value?.pause();
};

const getState = () => {
  const state = livePhotoRef.value?.getState();
  console.log(state);
};
</script>
```

| 方法 | 说明 |
|------|------|
| `play()` | 播放视频 |
| `pause()` | 暂停视频 |
| `stop()` | 停止视频 |
| `getState()` | 获取播放状态 |

---

### LivePhotoMute

静音按钮组件，可单独使用。

```vue
<template>
  <LivePhotoMute v-model="isMuted" />
</template>

<script setup>
import { ref } from 'vue';
import { LivePhotoMute } from 'giovan-live-photo';

const isMuted = ref(true);
</script>
```

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `modelValue` | `boolean` | - | 静音状态 |

#### Events

| 事件 | 参数 | 说明 |
|------|------|------|
| `update:modelValue` | `boolean` | 静音状态变化 |

---

### LivePhotoIndicator

LIVE 指示器组件。

```vue
<template>
  <LivePhotoIndicator 
    :is-playing="isPlaying" 
    :can-play="canPlay" 
    :is-loading="isLoading"
  />
</template>

<script setup>
import { ref } from 'vue';
import { LivePhotoIndicator } from 'giovan-live-photo';

const isPlaying = ref(false);
const canPlay = ref(true);
const isLoading = ref(false);
</script>
```

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `isPlaying` | `boolean` | - | 是否正在播放 |
| `canPlay` | `boolean` | - | 视频是否可播放 |
| `isLoading` | `boolean` | `false` | 是否正在加载 |

---

## 触发模式

### longpress（长按）

移动端默认模式，用户长按图片触发播放。

```vue
<LivePhoto
  image-url="..."
  video-url="..."
  trigger-mode="longpress"
  :long-press-delay="200"
/>
```

### hover（悬停）

桌面端推荐模式，鼠标悬停时自动播放。

```vue
<LivePhoto
  image-url="..."
  video-url="..."
  trigger-mode="hover"
/>
```

### click（点击）

点击切换播放/暂停状态。

```vue
<LivePhoto
  image-url="..."
  video-url="..."
  trigger-mode="click"
/>
```

---

## ThumbHash 占位图

支持使用 ThumbHash 作为图片加载占位符，提供更好的用户体验。

### 使用 ThumbHash 字符串

```vue
<template>
  <LivePhoto
    image-url="https://example.com/photo.jpg"
    video-url="https://example.com/video.mov"
    thumb-hash="1QcSHQRnh493V4dIh4eXh1h4kJUI"
  />
</template>
```

### 使用占位图 URL

```vue
<template>
  <LivePhoto
    image-url="https://example.com/photo.jpg"
    video-url="https://example.com/video.mov"
    thumb-hash-url="https://example.com/thumb.jpg"
  />
</template>
```

### 加载流程

1. 显示 ThumbHash 占位图（模糊效果）
2. 后台加载原图
3. 原图加载完成后淡入显示
4. 用户交互时才触发视频播放

---

## 加载状态保护

组件内置加载状态保护机制：

- **图片未加载完成**：禁止触发视频播放，显示占位图
- **视频加载中**：显示旋转加载动画，禁止重复播放
- **加载中光标**：自动显示 `cursor: wait`

---

## 样式定制

### CSS 变量

```css
:root {
  --live-photo-radius: 12px;
  --live-photo-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  --live-photo-controls-bg: rgba(0, 0, 0, 0.4);
  --live-photo-controls-color: white;
  --live-photo-progress-color: white;
  --live-photo-progress-bg: rgba(255, 255, 255, 0.3);
  --live-photo-indicator-playing-color: rgb(250, 204, 21);
  --live-photo-indicator-playing-bg: rgba(250, 204, 21, 0.1);
}
```

### 自定义样式示例

```vue
<template>
  <LivePhoto class="custom-live-photo" ... />
</template>

<style>
.custom-live-photo {
  --live-photo-radius: 20px;
  --live-photo-controls-bg: rgba(0, 0, 0, 0.6);
}
</style>
```

---

## 完整示例

### 基础用法

```vue
<template>
  <LivePhoto
    image-url="https://example.com/photo.jpg"
    video-url="https://example.com/video.mov"
    :muted="true"
    trigger-mode="hover"
    @play="onPlay"
    @pause="onPause"
  />
</template>

<script setup>
import { LivePhoto } from 'giovan-live-photo';
import 'giovan-live-photo/style.css';

const onPlay = () => console.log('开始播放');
const onPause = () => console.log('暂停播放');
</script>
```

### 带 ThumbHash 占位图

```vue
<template>
  <LivePhoto
    image-url="https://example.com/photo.jpg"
    video-url="https://example.com/video.mov"
    thumb-hash="1QcSHQRnh493V4dIh4eXh1h4kJUI"
    trigger-mode="hover"
    :aspect-ratio="4 / 3"
  />
</template>

<script setup>
import { LivePhoto } from 'giovan-live-photo';
import 'giovan-live-photo/style.css';
</script>
```

### 带自定义控制

```vue
<template>
  <LivePhoto
    ref="livePhotoRef"
    :image-url="imageUrl"
    :video-url="videoUrl"
    v-model:muted="isMuted"
    :show-mute-button="false"
  >
    <template #controls="{ isPlaying }">
      <div class="custom-controls">
        <button @click="togglePlay">
          {{ isPlaying ? '暂停' : '播放' }}
        </button>
      </div>
    </template>
  </LivePhoto>
</template>

<script setup>
import { ref } from 'vue';
import { LivePhoto } from 'giovan-live-photo';
import 'giovan-live-photo/style.css';

const livePhotoRef = ref();
const isMuted = ref(true);

const togglePlay = () => {
  livePhotoRef.value?.getState().isPlaying
    ? livePhotoRef.value?.pause()
    : livePhotoRef.value?.play();
};
</script>
```

### 图片画廊

```vue
<template>
  <div class="gallery">
    <LivePhoto
      v-for="photo in photos"
      :key="photo.id"
      :image-url="photo.imageUrl"
      :video-url="photo.videoUrl"
      :thumb-hash="photo.thumbHash"
      trigger-mode="hover"
      :aspect-ratio="4 / 3"
    />
  </div>
</template>

<script setup>
import { LivePhoto } from 'giovan-live-photo';
import 'giovan-live-photo/style.css';

const photos = [
  { id: 1, imageUrl: '...', videoUrl: '...', thumbHash: '...' },
  { id: 2, imageUrl: '...', videoUrl: '...', thumbHash: '...' },
];
</script>

<style>
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}
</style>
```

---

## TypeScript

```typescript
import type {
  LivePhotoProps,
  LivePhotoState,
  TriggerMode,
  LivePhotoErrorCode,
  LivePhotoError,
} from 'giovan-live-photo';
```

---

## 浏览器支持

- Chrome >= 80
- Firefox >= 75
- Safari >= 13
- Edge >= 80

---

## License

MIT © giovan
