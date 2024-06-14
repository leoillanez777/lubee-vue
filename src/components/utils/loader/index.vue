<script setup lang="ts">
  import { ref, onMounted, watch, type PropType } from 'vue';

  const props = defineProps({
    active: Boolean,
    spinner: {
      type: String,
      default: 'spinner',
    },
    text: {
      type: String,
      default: '',
    },
    textStyle: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({}),
    },
    color: {
      type: String,
      default: '#000',
    },
    isFullScreen: {
      type: Boolean,
      default: false,
    },
    backgroundColor: {
      type: String,
      default: 'rgba(255, 255, 255, .9)',
    },
    size: {
      type: String,
      default: '40',
    },
    duration: {
      type: String,
      default: '0.6',
    },
    delay: {
      type: [String, Number],
      default: 0,
    },
  });

  const isActive = ref(props.active || false);
  const isActiveDelay = ref(false);

  const delayActive = (ms: number) => {
    isActiveDelay.value = true;
    setTimeout(() => {
      isActiveDelay.value = false;
    }, ms);
  };

  onMounted(() => {
    const velmld = document.querySelector('.velmld') as HTMLElement;
    if (velmld?.parentNode instanceof HTMLElement) {
      velmld.parentNode.classList.add('velmld-parent');
    }

    if (props.delay) {
      const delayMs = +props.delay * 1000;
      delayActive(delayMs);
    }
  });

  watch(() => props.active, (value) => {
    isActive.value = value;
    if (value) {
      const velmld = document.querySelector('.velmld') as HTMLElement;
      if (velmld?.parentNode instanceof HTMLElement) {
        velmld.parentNode.classList.add('velmld-parent');
      }
    }
  });
</script>

<template>
  <transition name="fade">
    <div
      v-show="isActive || isActiveDelay"
      :class="{ 'velmld-full-screen': isFullScreen }"
      :style="{ backgroundColor }"
      ref="velmld"
      class="velmld-overlay"
    >
      <div class="velmld-spinner">
        <slot name="default">
          <component
            :is="spinner"
            :color="color"
            :size="`${size}px`"
            :duration="`${duration}s`"
          />
        </slot>
        <div
          v-if="text.length"
          :style="{ color, ...textStyle }"
        >
          {{ text }}
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity .3s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
  .velmld-overlay {
    position: absolute;
    z-index: 3000;
    margin: 0;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transition: opacity .3s;
  }
  .velmld-spinner {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    position: absolute;
    text-align: center
  }
  .velmld-full-screen {
    position: fixed;
  }
</style>

<style>
  .velmld-parent {
    position: relative !important;
  }
</style>