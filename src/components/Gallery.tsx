import { useRef, useState } from 'react'
import { sized, srcSet } from '../lib/images'
import { IconCar, IconChevronLeft, IconChevronRight } from './Icons'

/** Galería con scroll-snap: swipe nativo en el celular, flechas y miniaturas en escritorio. */
export default function Gallery({ fotos, alt }: { fotos: string[]; alt: string }) {
  const track = useRef<HTMLDivElement>(null)
  const [actual, setActual] = useState(0)

  function ir(i: number) {
    const el = track.current
    if (!el) return
    const destino = Math.max(0, Math.min(fotos.length - 1, i))
    el.scrollTo({ left: destino * el.clientWidth, behavior: 'smooth' })
  }

  function onScroll() {
    const el = track.current
    if (!el) return
    setActual(Math.round(el.scrollLeft / el.clientWidth))
  }

  if (!fotos.length) {
    return (
      <div className="grid aspect-[4/3] place-items-center bg-carbon-2 text-line">
        <IconCar size={96} />
      </div>
    )
  }

  return (
    <div
      role="region"
      aria-roledescription="carrusel"
      aria-label={`Fotos de ${alt}`}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') ir(actual + 1)
        if (e.key === 'ArrowLeft') ir(actual - 1)
      }}
    >
      <div className="group relative bg-carbon-2">
        <div
          ref={track}
          onScroll={onScroll}
          tabIndex={0}
          className="no-scrollbar flex aspect-[4/3] snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-smooth"
        >
          {fotos.map((src, i) => (
            <img
              key={src + i}
              src={sized(src, 1400)}
              srcSet={srcSet(src, [700, 1100, 1600])}
              sizes="(min-width: 1024px) 60vw, 100vw"
              alt={`${alt}, foto ${i + 1} de ${fotos.length}`}
              loading={i === 0 ? 'eager' : 'lazy'}
              draggable={false}
              className="h-full w-full shrink-0 snap-center object-cover"
            />
          ))}
        </div>

        {fotos.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => ir(actual - 1)}
              disabled={actual === 0}
              aria-label="Foto anterior"
              className="absolute top-1/2 left-3 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-ink/70 backdrop-blur transition-opacity hover:bg-ink disabled:opacity-0 sm:grid"
            >
              <IconChevronLeft />
            </button>
            <button
              type="button"
              onClick={() => ir(actual + 1)}
              disabled={actual === fotos.length - 1}
              aria-label="Foto siguiente"
              className="absolute top-1/2 right-3 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-ink/70 backdrop-blur transition-opacity hover:bg-ink disabled:opacity-0 sm:grid"
            >
              <IconChevronRight />
            </button>
            <p className="tnum absolute right-3 bottom-3 bg-ink/75 px-2.5 py-1 text-xs font-semibold backdrop-blur" aria-live="polite">
              {actual + 1} / {fotos.length}
            </p>
          </>
        )}
      </div>

      {fotos.length > 1 && (
        <div className="no-scrollbar mt-2 flex gap-2 overflow-x-auto px-4 sm:px-0">
          {fotos.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => ir(i)}
              aria-label={`Ver foto ${i + 1}`}
              aria-current={i === actual}
              className={`relative aspect-[4/3] w-20 shrink-0 overflow-hidden transition-opacity sm:w-24 ${
                i === actual ? 'opacity-100 ring-2 ring-accent ring-inset' : 'opacity-50 hover:opacity-90'
              }`}
            >
              <img src={sized(src, 240)} alt="" loading="lazy" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
