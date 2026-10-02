import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import CarCard from '../components/CarCard'
import SellForm from '../components/SellForm'
import TrustStrip from '../components/TrustStrip'
import { IconArrowRight, IconWhatsApp } from '../components/Icons'
import { config } from '../config'
import { fotosSitio } from '../data/autos'
import { useAutos, useDocumentTitle } from '../hooks/useAutos'
import { agencia } from '../lib/agencia'
import { km, precio } from '../lib/format'
import { sized, srcSet } from '../lib/images'
import { linkWhatsApp, mensajes } from '../lib/whatsapp'

export default function Home() {
  useDocumentTitle(`${agencia.nombre} · Usados y 0KM en Quilmes`)
  const { autos } = useAutos()
  const { hash } = useLocation()

  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' })
  }, [hash])

  const disponibles = autos.filter((a) => !a.vendido)
  const destacados = [...disponibles.filter((a) => a.destacado), ...disponibles.filter((a) => !a.destacado)].slice(0, 6)
  const estrella = destacados[0]
  const heroFoto = estrella?.fotos[0] ?? fotosSitio.hero

  return (
    <>
      {/* HERO */}
      <section className="relative isolate flex min-h-[calc(100svh-4rem)] flex-col justify-end overflow-hidden lg:min-h-[44rem]">
        {/* En el celular la foto ocupa la parte de arriba para que el auto se vea entero */}
        <div className="absolute inset-x-0 top-0 -z-10 h-[58%] sm:h-[66%] lg:inset-0 lg:h-full">
          <img
            src={sized(heroFoto, 1800)}
            srcSet={srcSet(heroFoto, [800, 1200, 1800, 2400])}
            sizes="100vw"
            alt={estrella ? `${estrella.marca} ${estrella.modelo} ${estrella.anio} destacado` : ''}
            fetchPriority="high"
            className="h-full w-full animate-fade object-cover object-[35%_70%] lg:object-[60%_center]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-ink/30 lg:via-ink/25 lg:to-transparent" />
          <div className="absolute inset-0 hidden bg-gradient-to-r from-ink/80 via-ink/10 to-transparent lg:block" />
        </div>

        <div className="mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6 sm:pb-14 lg:pb-20">
          <p className="eyebrow flex animate-rise items-center gap-2 text-bone/80">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-accent shadow-[0_0_12px_var(--color-accent)]" />
            {config.zona}
          </p>
          <h1 className="mt-3 max-w-4xl animate-rise font-display text-[clamp(3.4rem,13vw,8.5rem)] font-extrabold uppercase leading-[0.84] tracking-[-0.01em] [animation-delay:80ms] [overflow-wrap:anywhere]">
            {agencia.nombre}
          </h1>
          <p className="mt-4 max-w-md animate-rise text-lg text-bone/85 [animation-delay:160ms] sm:text-xl">
            {config.claim}.
          </p>

          <div className="mt-7 flex animate-rise flex-col gap-3 [animation-delay:240ms] sm:flex-row">
            <Link to="/stock" className="btn-accent">
              Ver stock <IconArrowRight size={18} />
            </Link>
            <a href={linkWhatsApp(mensajes.general())} target="_blank" rel="noopener noreferrer" className="btn-outline bg-ink/30 backdrop-blur">
              <IconWhatsApp size={18} /> Consultar por WhatsApp
            </a>
          </div>

          {estrella && (
            <Link
              to={`/auto/${estrella.id}`}
              className="group mt-10 flex animate-rise items-center justify-between gap-4 border-t border-bone/20 pt-4 [animation-delay:320ms] lg:absolute lg:right-6 lg:bottom-20 lg:mt-0 lg:w-80 lg:border-t-0 lg:border-l lg:border-accent lg:bg-ink/60 lg:p-5 lg:backdrop-blur-md xl:right-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))]"
            >
              <div className="min-w-0">
                <p className="eyebrow text-[0.65rem]">En portada</p>
                <p className="mt-1 truncate font-display text-xl font-semibold uppercase leading-tight">
                  {estrella.marca} {estrella.modelo} {estrella.version}
                </p>
                <p className="tnum mt-0.5 text-sm text-mute">
                  {estrella.anio} · {km(estrella.km)} · <span className="text-bone">{precio(estrella.precio, estrella.moneda)}</span>
                </p>
              </div>
              <IconArrowRight size={22} className="shrink-0 transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </div>
      </section>

      <TrustStrip />

      {/* DESTACADOS */}
      <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 lg:pt-28" aria-labelledby="destacados-titulo">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Selección de la semana</p>
            <h2 id="destacados-titulo" className="mt-2 font-display text-5xl font-bold uppercase leading-none tracking-tight sm:text-6xl">
              Destacados
            </h2>
          </div>
          <Link to="/stock" className="group inline-flex items-center gap-2 font-semibold">
            Ver los {disponibles.length} autos
            <IconArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {destacados.map((a, i) => (
            <CarCard key={a.id} auto={a} prioridad={i < 2} />
          ))}
        </div>
      </section>

      <SellForm />
    </>
  )
}
