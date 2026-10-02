import { autosIniciales } from '../data/autos'
import type { Auto } from '../types'

/**
 * Capa de datos del stock.
 *
 * Toda la app habla con `autosRepo` y nunca con localStorage directamente.
 * Para pasar a Supabase alcanza con escribir otra implementación de
 * `AutosRepo` (por ejemplo `supabaseRepo` con supabase.from('autos')...)
 * y exportarla abajo en lugar de `localRepo`. Los métodos ya son async.
 */
export interface AutosRepo {
  listar(): Promise<Auto[]>
  obtener(id: string): Promise<Auto | undefined>
  guardar(auto: Auto): Promise<Auto>
  eliminar(id: string): Promise<void>
  restaurarDemo(): Promise<Auto[]>
}

// v2: stock real de Polcars con fotos de su Instagram (descarta la demo guardada en v1)
const KEY = 'agencia:autos:v2'

export class StorageLlenoError extends Error {
  constructor() {
    super('No hay más espacio para fotos en este navegador. Probá con menos fotos o usá links.')
  }
}

function leer(): Auto[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as Auto[]
  } catch {
    /* datos corruptos o storage bloqueado: usamos la demo */
  }
  return structuredClone(autosIniciales)
}

function escribir(autos: Auto[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(autos))
  } catch (e) {
    if (e instanceof DOMException && e.name === 'QuotaExceededError') throw new StorageLlenoError()
    throw e
  }
}

const localRepo: AutosRepo = {
  async listar() {
    return leer()
  },
  async obtener(id) {
    return leer().find((a) => a.id === id)
  },
  async guardar(auto) {
    const autos = leer()
    const i = autos.findIndex((a) => a.id === auto.id)
    if (i >= 0) autos[i] = auto
    else autos.unshift(auto)
    escribir(autos)
    avisar()
    return auto
  },
  async eliminar(id) {
    escribir(leer().filter((a) => a.id !== id))
    avisar()
  },
  async restaurarDemo() {
    localStorage.removeItem(KEY)
    avisar()
    return leer()
  },
}

export const autosRepo: AutosRepo = localRepo

/* Suscripción simple para que todas las vistas se actualicen al editar. */
type Listener = () => void
const listeners = new Set<Listener>()
function avisar() {
  listeners.forEach((l) => l())
}
export function suscribir(l: Listener) {
  listeners.add(l)
  return () => {
    listeners.delete(l)
  }
}

export function nuevoId(marca: string, modelo: string, anio: number) {
  const slug = `${marca}-${modelo}-${anio}`
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  return `${slug}-${Date.now().toString(36).slice(-4)}`
}
