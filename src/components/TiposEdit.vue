<script setup lang="ts">
  import { ref, reactive, type PropType } from 'vue';
  import type { TipoDTO } from '@/types/clasificado';
  
  const emit = defineEmits(['close', 'save'])
  const props = defineProps({
    edit: {
      type: Object as PropType<TipoDTO>,
      default: { id: 0, nombre: '' }
    }
  })
    
  const form = reactive<TipoDTO>(props.edit);
  const loading = ref(false);

  const onSubmit = (e: Event) => {
    e.preventDefault();
    loading.value = true;
    if (onControlForm()) {
      emit('save', form)
    }
    loading.value = false;
  }

  const onControlForm = ():Boolean => {
    let isValid = true;
    const formElement = document.querySelector('.needs-validation') as HTMLFormElement;
    formElement.addEventListener('submit', event => {
      if (!formElement.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
        isValid = false;
      }

      formElement.classList.add('was-validated')
    }, false)
    
    return isValid;
  }

  const onReset = (e: Event) => {
    e.preventDefault();
    form.id = 0;
    form.nombre = '';
    emit('close')
  }

</script>

<template>
  <BOverlay :show="loading" rounded="sm">
    <BForm @submit="onSubmit" @reset="onReset" class="needs-validation" novalidate>
      <div class="container">
        <div class="row">
          
          <div class="col-12 py-2">
            <BFormGroup id="input-group-1" label="Descripción:" label-for="input-nombre">
              <BFormInput id="input-nombre" v-model="form.nombre" type="text" placeholder="Ingrese Nombre" autofocus required maxlength="200" />
              <div class="invalid-feedback">
                Por favor, ingrese un nombre.
              </div>
            </BFormGroup>
          </div>

          <div class="col-12 mt-4 p-4 text-center fixed">
            <div class="row">
              <div class="col">
                <BButton type="submit" variant="primary" size="lg">
                  <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M11 16h2m6.707-9.293-2.414-2.414A1 1 0 0 0 16.586 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V7.414a1 1 0 0 0-.293-.707ZM16 20v-6a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v6h8ZM9 4h6v3a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V4Z"/>
                  </svg>
                  Grabar
                </BButton>
              </div>
              <div class="col">
                <BButton type="reset" variant="danger" size="lg">
                  <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="m6 6 12 12m3-6a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                  </svg>
                  Cancelar
                </BButton>
              </div>
            </div>
          </div>

        </div>
      </div>
      
    </BForm>
  </BOverlay>
</template>
