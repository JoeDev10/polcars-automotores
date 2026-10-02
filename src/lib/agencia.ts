import { config } from '../config'

/**
 * Datos de la agencia que se pueden personalizar por link:
 *   /?n=Tresa%20Autos&wa=5491140581259
 *
 * Se guardan en sessionStorage para que no se pierdan al navegar
 * dentro del sitio. Una visita nueva sin parámetros vuelve a los valores de config.ts.
 */
const KEY = 'agencia:link'

interface DatosLink {
  nombre?: string
  whatsapp?: string
}

function leerSesion(): DatosLink {
  try {
    return JSON.parse(sessionStorage.getItem(KEY) ?? '{}') as DatosLink
  } catch {
    return {}
  }
}

function resolver() {
  const params = new URLSearchParams(window.location.search)
  const guardado = leerSesion()

  const n = params.get('n')?.trim().slice(0, 40)
  const waRaw = params.get('wa')?.replace(/\D/g, '')
  const wa = waRaw && waRaw.length >= 10 && waRaw.length <= 15 ? waRaw : undefined

  const datos: DatosLink = {
    nombre: n || guardado.nombre,
    whatsapp: wa || guardado.whatsapp,
  }
  try {
    sessionStorage.setItem(KEY, JSON.stringify(datos))
  } catch {
    /* modo privado: seguimos sin persistir */
  }

  return {
    nombre: datos.nombre || config.nombre,
    whatsapp: datos.whatsapp || config.whatsapp,
    /** true si vino personalizado por link */
    personalizado: Boolean(datos.nombre || datos.whatsapp),
    /** Parámetros a sumar a los links compartidos para que el otro vea la misma agencia */
    query(): string {
      const q = new URLSearchParams()
      if (datos.nombre) q.set('n', datos.nombre)
      if (datos.whatsapp) q.set('wa', datos.whatsapp)
      const s = q.toString()
      return s ? `?${s}` : ''
    },
  }
}

export const agencia = resolver()

/** Teléfono legible: 5491123456789 -> +54 9 11 2345-6789 */
export function telefonoLegible(wa: string): string {
  const m = wa.match(/^54(9)?(11|\d{3,4})(\d{3,4})(\d{4})$/)
  if (!m) return `+${wa}`
  return `+54 ${m[1] ? '9 ' : ''}${m[2]} ${m[3]}-${m[4]}`
}
