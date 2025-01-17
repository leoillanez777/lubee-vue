<script setup lang="ts">
  import { ref, computed, onMounted, type PropType } from 'vue';
  import Loader from './loader/index.vue';
  import type { Media } from '@/types/mediafiles'
  import type { ImagenesDTO } from '@/types/clasificado'

  const props = defineProps({
    isInvalid: {
      type: Boolean,
      default: false,
    },
    media: {
      type: Array as PropType<ImagenesDTO[]>,
      default: () => [],
    },
    location: {
      type: String,
      default: '',
    },
    max: {
      type: Number,
      default: null,
    },
    maxFilesize: {
      type: Number,
      default: 4,
    },
    warnings: {
      type: Boolean,
      default: true,
    },
    headers: {
      type: Object as PropType<Record<string, string> | null>,
      default: null,
    },
  });

  const emit = defineEmits(['init', 'change', 'add', 'remove', 'max', 'maxFilesize']);

  let smedia:Media[] = [];
  if (props.media && props.media.length > 0) {
    props.media.forEach(m => {
      const newFile = base64ToFile(m.imagenBase64, `imagen[${m.id}]`, m.mime)
      const url = URL.createObjectURL(newFile);
      smedia.push({ url, file: newFile })
    })
    
  }

  const addedMedia = ref<Media[]>([]);
  const savedMedia = ref<Media[]>(smedia);
  const removedMedia = ref<Media[]>([]);
  const isLoading = ref(true);
  const config = ref({ headers: props.headers });

  const allMedia = computed(() => [...addedMedia.value]);

  const init = () => {
    config.value.headers = props.headers;
    setTimeout(() => (isLoading.value = false), 1000);
    emit('init', allMedia.value);
  };

  const fileChange = async (event: Event) => {
    isLoading.value = true;
    const input = event.target as HTMLInputElement;
    const files = input.files;

    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      if (!props.max || allMedia.value.length < props.max) {
        if (files[i].size <= props.maxFilesize * 1000000) {
          const formData = new FormData();
          const url = URL.createObjectURL(files[i]);
          formData.set('image', files[i]);

          const addedImage: Media = { url, file: files[i] };
          addedMedia.value.push(addedImage);
          
          emit('change', allMedia.value);
          emit('add', addedImage, addedMedia.value);
        } else {
          emit('maxFilesize', files[i].size);
          if (props.warnings) {
            alert(`The file you are trying to upload is too big. \nMaximum Filesize: ${props.maxFilesize}MB`);
          }
          break;
        }
      } else {
        emit('max');
        if (props.warnings) {
          alert(`You have reached the maximum number of files that you can upload. \nMaximum Files: ${props.max}`);
        }
        break;
      }
    }
    input.value = '';
    isLoading.value = false;
  };

  const removeAddedMedia = (index: number) => {
    const removedImage = addedMedia.value[index];
    addedMedia.value.splice(index, 1);

    emit('change', allMedia.value);
    emit('remove', removedImage, removedMedia.value);
  };

  const removeSavedMedia = (index: number) => {
    const removedImage = savedMedia.value[index];
    removedMedia.value.push(removedImage);
    savedMedia.value.splice(index, 1);

    emit('change', allMedia.value);
    emit('remove', removedImage, removedMedia.value);
  };

  onMounted(init);

  function base64ToFile(base64String: string, fileName: string, mimeType: string): File {
    const bstr = atob(base64String);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], fileName, { type: mimeType });
  }  

</script>

<template>
  <div>
      <div class="mu-container" :class="isInvalid?'mu-red-border':''">
          <Loader
              color="#0275d8" 
              :active="isLoading" 
              spinner="line-scale" 
              background-color = 'rgba(255, 255, 255, .4)'
          />
          <div class="mu-elements-wraper">
              
              <!--UPLOAD BUTTON-->
              <div class="mu-plusbox-container">
                  <label class="mu-plusbox">
                      <svg
                          class="mu-plus-icon"
                          xmlns="http://www.w3.org/2000/svg" 
                          width="1em" 
                          height="1em" 
                          preserveAspectRatio="xMidYMid meet" 
                          viewBox="0 0 24 24">
                              <g fill="none">
                                  <path 
                                      d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11s11-4.925 11-11S18.075 1 12 1zm1 15a1 1 0 1 1-2 0v-3H8a1 1 0 1 1 0-2h3V8a1 1 0 1 1 2 0v3h3a1 1 0 1 1 0 2h-3v3z" 
                                      fill="currentColor"/>
                              </g>
                      </svg>
                      <input @change="fileChange" type="file" accept="image/*" multiple hidden>
                  </label>     
              </div>

              <!--IMAGES PREVIEW-->
              
              <div v-for="(image, index) in savedMedia" :key="index" class="mu-image-container">
                  <img :src="image.url" alt=""  class="mu-images-preview">
                  <button @click="removeSavedMedia(index)" class="mu-close-btn" type="button">
                      <svg 
                          class='mu-times-icon' 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="0.65em" 
                          height="0.65em" 
                          preserveAspectRatio="xMidYMid meet" 
                          viewBox="0 0 352 512">
                              <path 
                                  d="m242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28L75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256L9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"
                                  fill="currentColor"    
                              />
                      </svg>
                  </button>
              </div>
              <div v-for="(image, index) in addedMedia" :key="index" class="mu-image-container">
                  <img :src="image.url" alt=""  class="mu-images-preview">
                  <button @click="removeAddedMedia(index)" class="mu-close-btn" type="button">
                      <svg 
                          class='mu-times-icon' 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="0.65em" 
                          height="0.65em" 
                          preserveAspectRatio="xMidYMid meet" 
                          viewBox="0 0 352 512">
                              <path 
                                  d="m242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28L75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256L9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"
                                  fill="currentColor"    
                              />
                      </svg>
                  </button>
              </div>
          </div>
      </div>
      <div>
          <div v-for="(image, index) in addedMedia" :key="index" class="mu-mt-1">
              <input type="text" name="added_media[]" :value="image.file!.name" hidden>
          </div>
          <div v-for="(image, index) in removedMedia" :key="index" class="mu-mt-1">
              <input type="text" name="removed_media[]" :value="image.file!.name" hidden>
          </div>
          <div v-if="allMedia.length" class="mu-mt-1">
              <input type="text" name="media" value="1" hidden>
          </div>
      </div>
  </div>
</template>


<style scoped>

.mu-container{
    background-color: #fbfbfb !important;
    border-radius: 5px !important;
    border-style: solid !important;
    border: 1px solid #9b9b9b !important;
    box-sizing: border-box !important;
    width: 100% !important;
    height: auto !important;
}

/* ----elements-wrapper--- */

.mu-elements-wraper {
  padding: 1rem !important;
  display: flex !important;
  flex-wrap: wrap !important;
}

/* ----plusbox--- */

.mu-plusbox-container{
    display: inline-flex !important;
    height: 90px !important;
    width: 140px !important;
    margin: 0.25rem !important;
}
.mu-plusbox {
    background-color: #ffffff !important;
    border: 1px dashed #818181 !important;
    border-radius: 5px !important;
    cursor: pointer !important;
    display: flex !important;
    flex-wrap: wrap !important;
    align-items: center !important;
    width: 140px !important;
    height: 90px !important;
}
.mu-plusbox:hover{
    background-color: #f1f1f1 !important;
}
.mu-plusbox:hover > .mu-plus-icon{
    color: #028296 !important;
}
.mu-plus-icon{
    color: #00afca !important;
    font-size: 3rem !important;
    flex: 1;
}

/* ----media-preview---- */

.mu-image-container{
    width: 140px !important;
    height: 90px !important;
    margin: 0.25rem !important;
    
    position: relative;
}
.mu-images-preview {
    border-radius: 5px !important;
    border: 1px solid #818181 !important;
    width: 140px !important;
    height: 90px !important;
    transition: filter 0.1s linear;
    object-fit: cover;
    object-position: center;
}
.mu-images-preview:hover{
    filter: brightness(90%);
}

.mu-close-btn{
    background: none !important;
	color:white !important;
	border: none !important;
	padding: 0px !important;
    margin:0px !important;
	cursor: pointer !important;

    position: absolute !important;
    top: 0px;
    right: 0px;
}
.mu-times-icon{
    font-size: 3rem !important;
    filter: drop-shadow(0px 0px 1px black);
}
.mu-close-btn:hover{
    color: red !important;
}

/* -------------------- */

.mu-red-border {
    border: 1px solid #dc3545 !important;
}

.mu-mt-1 {
  margin-top: 0.25rem !important;
}

/* -------------------- */

img {
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
}

</style>