import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import CarCard from '../components/CarCard'
import Etiqueta from '../components/Etiqueta'
import Gallery from '../components/Gallery'
import {
  IconArrowLeft,
  IconCalendar,
  IconCheck,
  IconFuel,
  IconGauge,
  IconGear,
  IconShare,
  IconWhatsApp,
} from '../components/Icons'
import { useAutos, useDocumentTitle } from '../hooks/useAutos'
import { agencia } from '../lib/agencia'
import { duenos, enUSD, km, precio } from '../lib/format'
import { linkWhatsApp, mensajes } from '../lib/whatsapp'
import type { Auto } from '../types'

function similares(auto: Auto, todos: Auto[]) {
  return todos
    .filter((a) => a.id !== auto.id && !a.vendido)
    .map((a) => ({
      a,
      score:
        (a.carroceria === auto.carroceria ? 3 : 0) +
        (a.marca === auto.marca ? 1 : 0) +
        Math.max(0, 2 - Math.abs(enUSD(a) - enUSD(auto)) / 5000) +
        Math.max(0, 1 - Math.abs(a.anio - auto.anio) / 5),
    }))
    .sort((x, y) => y.score - x.score)
    .slice(0, 3)
    .map((x) => x.a)
}

export default function AutoDetalle() {
  const { id } = useParams()
  const { autos, cargando } = useAutos()
  const auto = autos.find((a) => a.id === id)
  const [aviso, setAviso] = useState('')

  useDocumentTitle(auto ? `${auto.marca} ${auto.modelo} ${auto.anio} · ${agencia.nombre}` : agencia.nombre)

  if (cargando) return <div className="min-h-[60svh]" />

  if (!auto) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6">
        <p className="eyebrow">Error 404</p>
        <h1 className="mt-2 font-display text-5xl font-bold uppercase">Este auto ya no está publicado</h1>
        <p className="mt-3 text-mute">Puede que se haya vendido. Mirá el resto del stock o escribinos.</p>
        <Link to="/stock" className="btn-accent mt-8">Ver stock</Link>
      </div>
    )
  }

  const nombre = `${auto.marca} ${auto.modelo}`
  const wa = linkWhatsApp(
    auto.vendido
      ? `Hola ${agencia.nombre}, vi que el ${nombre} ${auto.anio} ya se vendió. ¿Tienen algo similar?`
      : mensajes.auto(auto),
  )

  async function compartir() {
    const url = `${window.location.origin}${import.meta.env.BASE_URL}auto/${auto!.id}${agencia.query()}`
    const data = { title: `${nombre} ${auto!.anio}`, text: `${nombre} ${auto!.version} ${auto!.anio} en ${agencia.nombre}`, url }
    try {
      if (navigator.share) {
        await navigator.share(data)
        return
      }
      await navigator.clipboard.writeText(url)
      setAviso('Link copiado')
    } catch (e) {
      if ((e as Error).name === 'AbortError') return
      setAviso('No se pudo copiar el link')
    }
    setTimeout(() => setAviso(''), 2500)
  }

  const ficha: [string, string][] = [
    ['Año', String(auto.anio)],
    ['Kilómetros', km(auto.km)],
    ['Motor', auto.motor],
    ['Combustible', auto.combustible],
    ['Caja', auto.caja],
    ['Carrocería', auto.carroceria],
    ['Color', auto.color],
    ['Puertas', String(auto.puertas)],
    ['VTV', auto.vtv ? 'Vigente' : 'A realizar'],
    ['Dueños', duenos(auto.duenos)],
  ]

  const rapidos = [
    { icon: IconCalendar, label: 'Año', valor: String(auto.anio) },
    { icon: IconGauge, label: 'Kilómetros', valor: km(auto.km) },
    { icon: IconFuel, label: 'Combustible', valor: auto.combustible },
    { icon: IconGear, label: 'Caja', valor: auto.caja },
  ]

  return (
    <article className="pb-28 lg:pb-0">
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
        <Link to="/stock" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-mute hover:text-bone">
          <IconArrowLeft size={18} /> Volver al stock
        </Link>
      </div>

      <div className="mx-auto grid max-w-7xl gap-8 sm:px-6 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <Gallery fotos={auto.fotos} alt={`${nombre} ${auto.version} ${auto.anio}`} />
        </div>

        <div className="px-4 sm:px-0 lg:col-span-5">
          {auto.vendido && (
            <p className="mb-5 border-l-2 border-danger bg-danger/10 px-4 py-3 text-sm font-semibold">
              Este auto ya fue vendido. Escribinos y te buscamos uno similar.
            </p>
          )}
          <div className="flex items-center gap-3">
            <p className="eyebrow">{auto.marca}</p>
            {auto.etiqueta && <Etiqueta valor={auto.etiqueta} />}
          </div>
          <h1 className="mt-1 font-display text-6xl font-bold uppercase leading-[0.88] tracking-tight sm:text-7xl">{auto.modelo}</h1>
          <p className="mt-2 text-lg text-mute">{auto.version}</p>

          <p className="tnum mt-6 font-display text-5xl font-semibold leading-none tracking-tight">{precio(auto.precio, auto.moneda)}</p>
          <p className="mt-1.5 text-sm text-mute">Consultá por financiación y permuta.</p>

          <dl className="mt-7 grid grid-cols-2 border-t border-l border-line">
            {rapidos.map(({ icon: Icon, label, valor }) => (
              <div key={label} className="border-r border-b border-line p-4">
                <dt className="flex items-center gap-2 text-xs text-mute">
                  <Icon size={16} /> {label}
                </dt>
                <dd className="tnum mt-1 font-display text-xl font-semibold uppercase">{valor}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-7 hidden gap-3 lg:flex">
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-accent flex-1">
              <IconWhatsApp size={18} /> Consultar por este auto
            </a>
            <button type="button" onClick={compartir} className="btn-outline" aria-label="Compartir el link del auto">
              <IconShare size={18} /> Compartir
            </button>
          </div>
          <button type="button" onClick={compartir} className="btn-outline mt-6 w-full lg:hidden">
            <IconShare size={18} /> Compartir este auto
          </button>
          <p role="status" className="mt-2 h-5 text-sm text-ok">
            {aviso && (
              <span className="inline-flex items-center gap-1.5">
                <IconCheck size={16} /> {aviso}
              </span>
            )}
          </p>

          {auto.descripcion && <p className="mt-4 leading-relaxed text-bone/90">{auto.descripcion}</p>}
        </div>
      </div>

      {/* Ficha técnica */}
      <section className="mx-auto mt-14 max-w-7xl px-4 sm:px-6" aria-labelledby="ficha">
        <h2 id="ficha" className="font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl">Ficha técnica</h2>
        <table className="mt-5 w-full border-t border-line text-left">
          <caption className="sr-only">Ficha técnica del {nombre}</caption>
          <tbody className="sm:grid sm:grid-cols-2 sm:gap-x-12">
            {ficha.map(([k, v]) => (
              <tr key={k} className="flex justify-between gap-4 border-b border-line py-3.5">
                <th scope="row" className="font-normal text-mute">{k}</th>
                <td className="tnum text-right font-medium">
                  {k === 'VTV' ? <span className={auto.vtv ? 'text-ok' : 'text-accent-ink'}>{v}</span> : v}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Similares */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6" aria-labelledby="similares">
        <h2 id="similares" className="font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl">También te puede interesar</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {similares(auto, autos).map((a) => (
            <CarCard key={a.id} auto={a} />
          ))}
        </div>
      </section>

      {/* Barra fija mobile */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-ink/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0">
            <p className="truncate text-xs text-mute">{nombre} {auto.anio}</p>
            <p className="tnum font-display text-xl leading-tight font-semibold">{precio(auto.precio, auto.moneda)}</p>
          </div>
          <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-accent ml-auto shrink-0 px-4">
            <IconWhatsApp size={18} /> {auto.vendido ? 'Pedir similar' : 'Consultar por este auto'}
          </a>
        </div>
      </div>
    </article>
  )
}
