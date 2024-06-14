<script setup lang="ts">
  import { ref } from 'vue';
  import Tipos from '@/components/Tipos.vue';
  const id = ref(0);  
</script>

<template>
  <div>
    <Tipos :id="id" />
  </div>
</template>

