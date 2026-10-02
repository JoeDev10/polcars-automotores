import type { Etiqueta as TEtiqueta } from '../types'

const estilos: Record<TEtiqueta, string> = {
  Oportunidad: 'bg-accent text-on-accent',
  'Recién ingresado': 'bg-bone text-ink',
  'Único dueño': 'bg-ink/80 text-bone ring-1 ring-bone/30 backdrop-blur',
}

export default function Etiqueta({ valor, className = '' }: { valor: TEtiqueta; className?: string }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-1 text-[0.7rem] font-bold uppercase tracking-[0.12em] ${estilos[valor]} ${className}`}
    >
      {valor}
    </span>
  )
}
