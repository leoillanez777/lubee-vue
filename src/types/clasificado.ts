import type { Media } from "./mediafiles";
import type { Address } from './googlemap';

interface ClasificadoBase {
  id: number
  descripcion: string
  ambientes: number
  m2: number
  antiguedad: number
  tipoPropiedad: TipoDTO
  tipoOperacion: TipoDTO
  archivos: Media[]
}

export interface TipoDTO {
  id: number
  nombre: string
}

export interface ImagenesDTO {
  id: number
  clasificadoId: number
  imagen: string
  mime: string
  imagenBase64: string
}

export interface ClasificadoDTO extends ClasificadoBase {
  tipoPropiedadId: number
  tipoOperacionId: number
  show: boolean
  ubicacion: {
    direccion: string,
    latitud: number,
    longitud: number
  }
  imagenes: ImagenesDTO[]
}

export interface RowDto extends ClasificadoBase {
  tipoPropiedadId: number | null
  tipoOperacionId: number | null
  ubicacion: Address
  imagenes: ImagenesDTO[]
}