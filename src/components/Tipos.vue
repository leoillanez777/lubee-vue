<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import type { TipoDTO } from '@/types/clasificado';
  import type { ResponseDto } from '@/types/response';
  import TiposEdit from './TiposEdit.vue';

  const props = defineProps({ id: Number })

  interface TipoRow extends TipoDTO {
    show?: boolean
  }

  const defaulEdit = { id: 0, nombre: '' };
  const modal = ref(false)
  const popover = ref(false)
  const showMsg = ref(false)
  const errorMsg = ref('')
  const loading = ref(false)
  const rows = ref<TipoRow[]>([])
  const rowEdit = ref<TipoDTO>(defaulEdit)

  onMounted(async () => {
    loading.value = true;
    try {
      const headers = { 'Content-Type': 'application/json' };
      const axiosInstance = axios.create({ headers });
      const response = await axiosInstance.get<ResponseDto<TipoDTO[]>>(`Tipos?serviceType=${props.id}`)
      if (response.data.success && response.data.result !== undefined) {
        rows.value = [...response.data.result]
      }

    }
    catch (error) {
      showMsg.value = true
      errorMsg.value = JSON.stringify(error)
      console.log(error)
    }
    finally {
      loading.value = false;
    }

  })

  const onOpenModal = (cond: boolean) => {
    if (cond) {
      rowEdit.value = defaulEdit;
    }
    modal.value = cond;
  }

  const onUpdate = async (row:TipoDTO) => {
    const okResult = await onSaveServer(row);
    if (okResult) {
      if (row.id === 0) {
        rows.value.push(row);
      } else {
        const index = rows.value.findIndex(item => item.id === row.id);
        if (index !== -1) {
          rows.value[index] = row;
        } else {
          rows.value.push(row);
        }
      }
      rowEdit.value = defaulEdit;
      modal.value = false;
    }   
  }

  const onSaveServer = async (row:TipoDTO):Promise<boolean> => {
    loading.value = true;
    let existo = false;
    const axiosInstance = axios.create();
    const headers = { 'Content-Type': 'application/json' };
    try {
      const response = await axiosInstance.post<ResponseDto<TipoDTO>>(`Tipos?serviceType=${props.id}`, JSON.stringify(row), { headers });
      if (response.data.success && response.data.result) {
        row.id = response.data.result.id;
        existo = true;
      }
    }
    catch (error) {
      showMsg.value = true
      errorMsg.value = JSON.stringify(error)
      console.log(error)
    }
    finally {
      loading.value = false  
    }

    return existo;
  }

  const onEdit = (row:TipoDTO) => {
    rowEdit.value = {...row};
    modal.value = true;
  }

  const onDelete = (row:TipoDTO) => {
    rowEdit.value = {...row};
    popover.value = true;
  }

  const DeleteRow = async () => {
    loading.value = true
    const axiosInstance = axios.create()
    try {
      const response = await axiosInstance.delete<ResponseDto<boolean>>(`Tipos?id=${rowEdit.value.id}&serviceType=${props.id}`);
      if (response.data.success && response.data.result) {
        const index = rows.value.findIndex(item => item.id === rowEdit.value.id);
        if (index !== -1) {
          rows.value.splice(index, 1);
          rowEdit.value = defaulEdit;
        }
      }
    }
    catch (error) {
      showMsg.value = true
      errorMsg.value = JSON.stringify(error)
      console.log(error)
    }
    finally {
      loading.value = false
      
    }
  }
</script>

<template>
  <div>
    <Teleport to="body">
      <div class="toast-container position-fixed p-3 top-0 end-0">
        <BToast v-model="showMsg">
          <template #title> Atención! </template>
          {{ errorMsg }}
        </BToast>
      </div>
    </Teleport>
    <BOverlay :show="loading" rounded="sm">
      <div class="card">
        <div class="card-header">
          <button @click="onOpenModal(true)" type="button" class="btn btn-light">
            <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 7.757v8.486M7.757 12h8.486M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
            </svg>
            Nuevo
          </button>
        </div>
        <div class="card-body">
          <div class="container text-center">
            <div class="row">
              <div class="col-3 fw-bold mb-2">
                Nº
              </div>
              <div class="col-6 fw-bold mb-2">Nombre</div>
              <div class="col-3 fw-bold mb-2">Opciones</div>
            </div>
            <div class="row" v-for="(row, index) in rows" :key="index">
              <div class="col-3 border">{{row.id}}</div>
              <div class="col-6 border">
                {{row.nombre}}
                
              </div>
              <div class="col-3 border">
                <BDropdown v-model="row.show" text="Dropdown Button" size="sm" variant="link">
                  <template #button-content> 
                    <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13v-2a1 1 0 0 0-1-1h-.757l-.707-1.707.535-.536a1 1 0 0 0 0-1.414l-1.414-1.414a1 1 0 0 0-1.414 0l-.536.535L14 4.757V4a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v.757l-1.707.707-.536-.535a1 1 0 0 0-1.414 0L4.929 6.343a1 1 0 0 0 0 1.414l.536.536L4.757 10H4a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h.757l.707 1.707-.535.536a1 1 0 0 0 0 1.414l1.414 1.414a1 1 0 0 0 1.414 0l.536-.535 1.707.707V20a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-.757l1.707-.708.536.536a1 1 0 0 0 1.414 0l1.414-1.414a1 1 0 0 0 0-1.414l-.535-.536.707-1.707H20a1 1 0 0 0 1-1Z"/>
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
                    </svg>
                    <span class="visually-hidden">Opciones</span> 
                  </template>
                  <BDropdownItem @click="onEdit(row)">
                    <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>
                    </svg>
                    Editar
                  </BDropdownItem>
                  <BDropdownDivider />
                  <BDropdownItem @click="onDelete(row)">
                    <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="m6 6 12 12m3-6a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                    </svg>
                    Eliminar
                  </BDropdownItem>
                </BDropdown>
              </div>
            </div>
          </div>    
        </div>
      </div>
      
      <BModal v-model="modal" title="Editar Clasificado" :hide-footer="true" scrollable centered size="lg">
        <TiposEdit v-if="modal" :edit="rowEdit" @close="onOpenModal(false)" @save="onUpdate" />
      </BModal>
      <BModal v-model="popover" title="¿Desea Eliminar?" ok-title="Eliminar" cancel-title="Cancelar" @ok="DeleteRow"> 
        <p>Esta seguro de eliminar el registro:</p>
        <div>
          {{ rowEdit.nombre }}
        </div>
      </BModal>
    </BOverlay>
  </div>
</template>
