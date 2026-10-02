import { config } from '../config'
import type { Auto, Moneda } from '../types'

/** Separador de miles argentino, sin depender del redondeo de Intl con 4 dígitos. */
export function miles(n: number): string {
  return Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

/** USD 18.500  /  $ 24.900.000  /  Consultar (precio 0 = sin publicar) */
export function precio(valor: number, moneda: Moneda): string {
  if (!valor) return 'Consultar'
  return moneda === 'USD' ? `USD ${miles(valor)}` : `$ ${miles(valor)}`
}

/** 87.000 km */
export function km(valor: number): string {
  return `${miles(valor)} km`
}

/** Precio llevado a USD para filtrar y ordenar autos cargados en distintas monedas. */
export function enUSD(auto: Pick<Auto, 'precio' | 'moneda'>): number {
  return auto.moneda === 'USD' ? auto.precio : auto.precio / config.cotizacionUSD
}

export function titulo(auto: Pick<Auto, 'marca' | 'modelo'>): string {
  return `${auto.marca} ${auto.modelo}`
}

export function duenos(n: number): string {
  return n === 1 ? '1 dueño' : `${n} dueños`
}
