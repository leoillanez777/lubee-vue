<script setup lang="ts">
  import { ref, reactive, onMounted, type PropType } from 'vue';
  import type { Media } from '@/types/mediafiles';
  import type { RowDto, TipoDTO } from '@/types/clasificado';
  import type { ResponseDto } from '@/types/response';
  import GoogleMapLoader from './GoogleMapLoader.vue';
  import Uploader from './utils/Uploader.vue';
  import axios from 'axios';
  
  const emit = defineEmits(['close', 'save'])
  const props = defineProps({
    editValue: {
      type: Object as PropType<RowDto>,
      default: {
        id: 0,
        descripcion: '',
        ambientes: 0,
        m2: 0,
        antiguedad: 0,
        tipoPropiedadId: null,
        tipoOperacionId: null,
        tipoOperacion: { id: 0, nombre: '' },
        tipoPropiedad: { id: 0, nombre: '' },
        ubicacion: { geometry : { location: { lat: -31.51962338875692, lng: -68.50751772094085 } }, 
          formatted_address: 'Las Heras 1233, J5411 Santa Lucía, San Juan, Argentina' },
        imagenes: []
      }
    }
  })
    
  const form = reactive<RowDto>(props.editValue);

  const onSubmitted = ref(false);
  const loading = ref(false);

  const tipoPropiedades = ref<TipoDTO[]>([]);
  const tipoOperaciones = ref<TipoDTO[]>([]);

  onMounted(async () => {
    loading.value = true
    const axiosInstance = axios.create();
    const headers = { 'Content-Type': 'application/json' };

    try {
      const resOper = await axiosInstance.get<ResponseDto<TipoDTO[]>>('tipos?serviceType=0', { headers });
      if (resOper.data.success && resOper.data.result) {
        tipoOperaciones.value = [...resOper.data.result]
      }
      
      const resProp = await axiosInstance.get<ResponseDto<TipoDTO[]>>('tipos?serviceType=1', { headers });
      if (resProp.data.success && resProp.data.result) {
        tipoPropiedades.value = [...resProp.data.result]
      }

      if (form.imagenes) {
        form.imagenes.forEach(img => {
          
        });
      }
    }
    catch (error) {
      console.log(error)
    }
    finally {
      loading.value = false
    }
  })

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
    onSubmitted.value = true;
    
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
    form.descripcion = '';
    form.id = form.ambientes = 0;
    form.m2 = form.antiguedad = 0;
    form.tipoPropiedad = { id: 0, nombre: '' };
    form.tipoPropiedadId = null;
    form.tipoOperacion = { id: 0, nombre: '' };
    form.tipoOperacionId = null;
    form.ubicacion = { geometry : { location: { lat: -31.51962338875692, lng: -68.50751772094085 } }, 
      formatted_address: 'Las Heras 1233, J5411 Santa Lucía, San Juan, Argentina' };
    form.imagenes = [];
    emit('close')
  }

  const onChangeMedia = (media: Media[]) => {
    form.archivos = media
  }
  
  type propOrOpe = 'Propiedades' | 'Operaciones';
  const onChangeSelect = (prop: propOrOpe, e: Event) => {
    const selectElement = e.target as HTMLSelectElement;
    const elemFind = selectElement.value;
    const optionsArray = [...selectElement.options];

    const labelName = optionsArray.find(op=> op.value === elemFind)?.label ?? "";
    if (prop === 'Propiedades') {
      form.tipoPropiedad.id = parseInt(elemFind, 10);
      form.tipoPropiedad.nombre = labelName;
    }
    else {
      form.tipoOperacion.id = parseInt(elemFind, 10);
      form.tipoOperacion.nombre = labelName;
    }
  }

</script>

<template>
  <BOverlay :show="loading" rounded="sm">
    <BForm @submit="onSubmit" @reset="onReset" class="needs-validation" novalidate>
      <div class="container">
        <div class="row">
          <div class="col-12">
            <Uploader @change="onChangeMedia" :media="form.imagenes" />
          </div>
          <div class="col-12 py-2">
            <BFormGroup id="input-group-1" label="Descripción:" label-for="input-descripcion">
              <BFormInput id="input-descripcion" v-model="form.descripcion" type="text" placeholder="Ingrese Descripción" required maxlength="200" />
              <div class="invalid-feedback">
                Por favor, ingrese una descripción.
              </div>
            </BFormGroup>
          </div>

          <div class="col-12 col-md-4 py-2">
            <BFormGroup id="input-group-2" label="Ambientes:" label-for="input-ambientes">
              <BFormInput id="input-ambientes" v-model="form.ambientes" type="number" placeholder="Ingrese cantidad de habitaciones" required min="0" max="1000" />
              <div class="invalid-feedback">
                Por favor, ingrese la cantidad de ambientes.
              </div>
            </BFormGroup>
          </div>
          <div class="col-12 col-md-4 py-2">
            <BFormGroup id="input-group-3" label="Metros Cuadrados:" label-for="input-m2">
              <BFormInput id="input-m2" v-model="form.m2" type="number" placeholder="Ingrese metros cuadrados" required min="0" />
              <div class="invalid-feedback">
                Por favor, ingrese la cantidad de metros cuadrados.
              </div>
            </BFormGroup>
          </div>
          <div class="col-12 col-md-4 py-2">
            <BFormGroup id="input-group-4" label="Antigüedad (años):" label-for="input-antiguedad">
              <BFormInput id="input-antiguedad" v-model="form.antiguedad" type="number" placeholder="Ingrese años" required min="0" />
            </BFormGroup>
          </div>

          <div class="col-12 col-md-6 py-2">
            <BFormGroup id="input-group-5" label="Tipo de Propiedad:" label-for="input-tipoPropiedades">
              <BFormSelect id="input-tipoPropiedades" v-model="form.tipoPropiedadId" :options="tipoPropiedades" 
                value-field="id" text-field="nombre" required @change="onChangeSelect('Propiedades', $event)" />
            </BFormGroup>
          </div>
          <div class="col-12 col-md-6 py-2">
            <BFormGroup id="input-group-6" label="Tipo de Operación:" label-for="input-tipoOperaciones">
              <BFormSelect id="input-tipoOperaciones" v-model="form.tipoOperacionId" :options="tipoOperaciones" 
                value-field="id" text-field="nombre" required @change="onChangeSelect('Operaciones', $event)" />
            </BFormGroup>
          </div>

          <div class="col-12 py-2">
            <BFormGroup id="input-group-7" label="Ubicación:" label-for="input-7">
              <div v-if="onSubmitted && form.ubicacion.formatted_address === ''" class="invalid-feedback d-block">
                Por favor, ingrese una ubicación. 
                <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 13V8m0 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                </svg>
              </div>
              <GoogleMapLoader v-model="form.ubicacion" height-map="200px" />
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
