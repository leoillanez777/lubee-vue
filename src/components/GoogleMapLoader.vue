<script setup lang="ts">
  import GoogleMap from 'vue-google-maps-ui';
  import { ref, watch } from 'vue';
  import type { Address } from '@/types/googlemap'
  
  const emit = defineEmits(['update:modelValue'])
  const props = withDefaults(defineProps<{ 
    heightMap: string; 
    modelValue: Address 
  }>(), { heightMap: '300px' })

  const apikey = ref(import.meta.env.VITE_API_KEY_GOOGLE_MAP)
  const address = ref(props.modelValue)
  const googleMapRef = ref<InstanceType<typeof GoogleMap> | null>(null)

  watch(
    () => googleMapRef.value?.$data.address,
    (address) => {
      if (address !== null) {
        updateLocation(address);
      }
    },
    { flush: 'post' }
  )
  
  const updateLocation = (addresValue:string) => {
    if (googleMapRef.value && googleMapRef.value.addressInfo) {
      if (!addresValue) {
        address.value.geometry.location.lat = null;
        address.value.geometry.location.lng = null;
        address.value.formatted_address = "";
      }
      else {
        address.value.geometry.location.lat = googleMapRef.value.addressInfo.geometry.location.lat();
        address.value.geometry.location.lng= googleMapRef.value.addressInfo.geometry.location.lng();
        address.value.formatted_address = googleMapRef.value.addressInfo.formatted_address;
      }
      emit('update:modelValue', address.value);
    }
  }
  
</script>

<template>
  <div>
    <GoogleMap language="es" :api-key="apikey" ref="googleMapRef" 
      :height="heightMap"
      :current-address="address" 
      :autocomplete="true"/>
  </div>
</template>