import { Link } from 'react-router-dom'
import { km, precio } from '../lib/format'
import { sized, srcSet } from '../lib/images'
import type { Auto } from '../types'
import { IconCar } from './Icons'
import Etiqueta from './Etiqueta'

export default function CarCard({ auto, prioridad = false }: { auto: Auto; prioridad?: boolean }) {
  const portada = auto.fotos[0]
  return (
    <article className="group relative flex flex-col bg-carbon ring-1 ring-line/70 transition-shadow duration-300 hover:ring-mute/50">
      <div className="relative aspect-[4/3] overflow-hidden bg-carbon-2">
        {portada ? (
          <img
            src={sized(portada, 800)}
            srcSet={srcSet(portada, [480, 800, 1100])}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            alt={`${auto.marca} ${auto.modelo} ${auto.version} ${auto.anio}, color ${auto.color.toLowerCase()}`}
            loading={prioridad ? 'eager' : 'lazy'}
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
          />
        ) : (
          <div className="grid h-full place-items-center text-line">
            <IconCar size={64} />
          </div>
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/45 to-transparent" />
        {auto.etiqueta && <Etiqueta valor={auto.etiqueta} className="absolute top-3 left-3" />}
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="eyebrow text-[0.68rem]">{auto.marca}</p>
        <h3 className="mt-0.5 font-display text-[1.7rem] font-bold uppercase leading-none tracking-tight">
          <Link to={`/auto/${auto.id}`} className="after:absolute after:inset-0 focus-visible:outline-none">
            {auto.modelo}
          </Link>
        </h3>
        <p className="mt-1 truncate text-sm text-mute">{auto.version}</p>

        <div className="mt-4 flex items-end justify-between gap-3 border-t border-line/70 pt-3">
          <p className="tnum text-sm text-mute">
            <span className="text-bone">{auto.anio}</span>
            <span aria-hidden="true" className="mx-2 text-line">|</span>
            {km(auto.km)}
          </p>
          <p className="tnum font-display text-2xl font-semibold leading-none tracking-tight">{precio(auto.precio, auto.moneda)}</p>
        </div>
      </div>
      {/* Foco visible sobre toda la tarjeta cuando se navega con teclado */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 ring-2 ring-accent ring-offset-2 ring-offset-ink opacity-0 group-has-[a:focus-visible]:opacity-100" />
    </article>
  )
}
