import { agencia } from './agencia'
import { km } from './format'
import type { Auto } from '../types'

export function linkWhatsApp(mensaje: string): string {
  return `https://wa.me/${agencia.whatsapp}?text=${encodeURIComponent(mensaje)}`
}

export const mensajes = {
  general: () => `Hola ${agencia.nombre}, vi su web y quiero hacer una consulta.`,

  auto: (a: Auto) =>
    `Hola ${agencia.nombre}, vi el ${a.marca} ${a.modelo} ${a.anio} de ${km(a.km)} publicado en su web y quiero más info.`,

  vender: (d: { marca: string; modelo: string; anio: string; km: string; operacion: string }) =>
    [
      `Hola ${agencia.nombre}, quiero ${d.operacion} mi auto:`,
      `• ${d.marca} ${d.modelo}`,
      `• Año ${d.anio}`,
      d.km ? `• ${d.km} km` : null,
      '¿Me pueden pasar una cotización?',
    ]
      .filter(Boolean)
      .join('\n'),
}
