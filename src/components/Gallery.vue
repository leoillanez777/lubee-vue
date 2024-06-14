<script setup lang="ts">
  import { ref } from 'vue';
  
  
  const images = ref([])

  const changeMedia = (media:any) => {
    images.value = media
  }


</script>

<template>
  <Uploader @change="changeMedia" />
</template>