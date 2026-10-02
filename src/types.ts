export type Moneda = 'USD' | 'ARS'
export type Combustible = 'Nafta' | 'Diésel' | 'GNC' | 'Híbrido'
export type Caja = 'Manual' | 'Automática'
export type Carroceria = 'Hatchback' | 'Sedán' | 'SUV' | 'Pick-up'
export type Etiqueta = 'Recién ingresado' | 'Oportunidad' | 'Único dueño'

export interface Auto {
  id: string
  marca: string
  modelo: string
  version: string
  anio: number
  km: number
  precio: number
  moneda: Moneda
  combustible: Combustible
  caja: Caja
  carroceria: Carroceria
  motor: string
  color: string
  puertas: number
  vtv: boolean
  duenos: number
  /** La primera foto es la portada. URLs o dataURLs. */
  fotos: string[]
  etiqueta?: Etiqueta | null
  descripcion?: string
  destacado: boolean
  vendido: boolean
  /** ISO date, para ordenar por "más nuevos" */
  creadoEn: string
}

export const COMBUSTIBLES: Combustible[] = ['Nafta', 'Diésel', 'GNC', 'Híbrido']
export const CAJAS: Caja[] = ['Manual', 'Automática']
export const CARROCERIAS: Carroceria[] = ['Hatchback', 'Sedán', 'SUV', 'Pick-up']
export const ETIQUETAS: Etiqueta[] = ['Recién ingresado', 'Oportunidad', 'Único dueño']
