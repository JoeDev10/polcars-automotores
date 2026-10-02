import { useEffect, useId, useMemo, useRef, useState } from 'react'
import CarCard from '../components/CarCard'
import { IconClose, IconSearch, IconSliders } from '../components/Icons'
import { useAutos, useDocumentTitle } from '../hooks/useAutos'
import { agencia } from '../lib/agencia'
import { enUSD, miles } from '../lib/format'
import { CAJAS, COMBUSTIBLES, type Auto, type Caja, type Combustible } from '../types'

interface Filtros {
  q: string
  marca: string
  anioDesde: string
  anioHasta: string
  precioMin: string
  precioMax: string
  kmMax: string
  combustibles: Combustible[]
  cajas: Caja[]
}

const vacios: Filtros = {
  q: '',
  marca: '',
  anioDesde: '',
  anioHasta: '',
  precioMin: '',
  precioMax: '',
  kmMax: '',
  combustibles: [],
  cajas: [],
}

const ORDENES = {
  recientes: { label: 'Más recientes', fn: (a: Auto, b: Auto) => b.creadoEn.localeCompare(a.creadoEn) },
  precioAsc: { label: 'Menor precio', fn: (a: Auto, b: Auto) => enUSD(a) - enUSD(b) },
  precioDesc: { label: 'Mayor precio', fn: (a: Auto, b: Auto) => enUSD(b) - enUSD(a) },
  anioDesc: { label: 'Año: más nuevos', fn: (a: Auto, b: Auto) => b.anio - a.anio },
  anioAsc: { label: 'Año: más viejos', fn: (a: Auto, b: Auto) => a.anio - b.anio },
  kmAsc: { label: 'Menos kilómetros', fn: (a: Auto, b: Auto) => a.km - b.km },
} as const
type Orden = keyof typeof ORDENES

const KM_OPCIONES = [30000, 60000, 100000, 150000]

const normalizar = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

function contarActivos(f: Filtros) {
  return (
    (f.marca ? 1 : 0) +
    (f.anioDesde || f.anioHasta ? 1 : 0) +
    (f.precioMin || f.precioMax ? 1 : 0) +
    (f.kmMax ? 1 : 0) +
    f.combustibles.length +
    f.cajas.length
  )
}

export default function Stock() {
  useDocumentTitle(`Stock · ${agencia.nombre}`)
  const { autos, cargando } = useAutos()
  const [f, setF] = useState<Filtros>(vacios)
  const [orden, setOrden] = useState<Orden>('recientes')
  const [panelAbierto, setPanelAbierto] = useState(false)

  const disponibles = useMemo(() => autos.filter((a) => !a.vendido), [autos])
  const marcas = useMemo(() => [...new Set(disponibles.map((a) => a.marca))].sort(), [disponibles])
  const anios = useMemo(() => {
    const ys = disponibles.map((a) => a.anio)
    if (!ys.length) return []
    const min = Math.min(...ys)
    const max = Math.max(...ys)
    return Array.from({ length: max - min + 1 }, (_, i) => max - i)
  }, [disponibles])

  const resultado = useMemo(() => {
    const q = normalizar(f.q.trim())
    return disponibles
      .filter((a) => {
        if (q && !normalizar(`${a.marca} ${a.modelo} ${a.version} ${a.anio} ${a.color}`).includes(q)) return false
        if (f.marca && a.marca !== f.marca) return false
        if (f.anioDesde && a.anio < +f.anioDesde) return false
        if (f.anioHasta && a.anio > +f.anioHasta) return false
        const usd = enUSD(a)
        if (f.precioMin && usd < +f.precioMin) return false
        if (f.precioMax && usd > +f.precioMax) return false
        if (f.kmMax && a.km > +f.kmMax) return false
        if (f.combustibles.length && !f.combustibles.includes(a.combustible)) return false
        if (f.cajas.length && !f.cajas.includes(a.caja)) return false
        return true
      })
      .sort(ORDENES[orden].fn)
  }, [disponibles, f, orden])

  const activos = contarActivos(f)

  return (
    <div className="mx-auto max-w-7xl px-4 pt-10 pb-20 sm:px-6 lg:pt-14">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">{agencia.nombre}</p>
          <h1 className="mt-1 font-display text-6xl font-bold uppercase leading-none tracking-tight sm:text-7xl">Stock</h1>
        </div>
        <p className="tnum text-mute" aria-live="polite">
          {cargando ? 'Cargando…' : `${resultado.length} de ${disponibles.length} autos`}
        </p>
      </header>

      {/* Búsqueda + orden */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Buscar por marca, modelo o versión</span>
          <IconSearch size={20} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-mute" />
          <input
            type="search"
            className="field pl-11"
            placeholder="Buscá por marca, modelo o versión"
            value={f.q}
            onChange={(e) => setF({ ...f, q: e.target.value })}
          />
        </label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setPanelAbierto(true)}
            className="btn-outline flex-1 lg:hidden"
            aria-haspopup="dialog"
          >
            <IconSliders size={18} /> Filtros
            {activos > 0 && (
              <span className="tnum grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-xs text-on-accent">{activos}</span>
            )}
          </button>
          <label className="flex-1 sm:w-56 sm:flex-none">
            <span className="sr-only">Ordenar por</span>
            <select className="field" value={orden} onChange={(e) => setOrden(e.target.value as Orden)}>
              {Object.entries(ORDENES).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[17rem_1fr]">
        {/* Filtros escritorio */}
        <aside className="hidden lg:block" aria-label="Filtros">
          <div className="sticky top-24">
            <PanelFiltros f={f} setF={setF} marcas={marcas} anios={anios} />
          </div>
        </aside>

        {/* Grilla */}
        <section aria-label="Resultados">
          {resultado.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
              {resultado.map((a, i) => (
                <CarCard key={a.id} auto={a} prioridad={i < 2} />
              ))}
            </div>
          ) : (
            !cargando && (
              <div className="border border-dashed border-line px-6 py-16 text-center">
                <p className="font-display text-3xl font-semibold uppercase">Sin resultados</p>
                <p className="mt-2 text-mute">Probá con menos filtros o escribinos: conseguimos el auto que buscás.</p>
                <button type="button" className="btn-light mt-6" onClick={() => setF(vacios)}>
                  Limpiar filtros
                </button>
              </div>
            )
          )}
        </section>
      </div>

      {/* Filtros mobile: hoja inferior */}
      <SheetFiltros abierto={panelAbierto} onCerrar={() => setPanelAbierto(false)} total={resultado.length}>
        <PanelFiltros f={f} setF={setF} marcas={marcas} anios={anios} enHoja />
      </SheetFiltros>
    </div>
  )
}

function PanelFiltros({
  f,
  setF,
  marcas,
  anios,
  enHoja = false,
}: {
  enHoja?: boolean
  f: Filtros
  setF: (f: Filtros) => void
  marcas: string[]
  anios: number[]
}) {
  const id = useId()
  const toggle = <T,>(lista: T[], v: T) => (lista.includes(v) ? lista.filter((x) => x !== v) : [...lista, v])
  const activos = contarActivos(f)

  return (
    <div className="space-y-7">
      <div className={`flex items-center ${enHoja ? 'justify-end' : 'justify-between'}`}>
        {!enHoja && <h2 className="font-display text-2xl font-semibold uppercase">Filtrar</h2>}
        {activos > 0 && (
          <button type="button" className="text-sm font-semibold text-mute underline underline-offset-4 hover:text-bone" onClick={() => setF({ ...vacios, q: f.q })}>
            Limpiar ({activos})
          </button>
        )}
      </div>

      <div>
        <label htmlFor={`${id}-marca`} className="label">Marca</label>
        <select id={`${id}-marca`} className="field" value={f.marca} onChange={(e) => setF({ ...f, marca: e.target.value })}>
          <option value="">Todas</option>
          {marcas.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
      </div>

      <fieldset>
        <legend className="label">Año</legend>
        <div className="grid grid-cols-2 gap-2">
          <select aria-label="Año desde" className="field" value={f.anioDesde} onChange={(e) => setF({ ...f, anioDesde: e.target.value })}>
            <option value="">Desde</option>
            {anios.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>
          <select aria-label="Año hasta" className="field" value={f.anioHasta} onChange={(e) => setF({ ...f, anioHasta: e.target.value })}>
            <option value="">Hasta</option>
            {anios.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>
        </div>
      </fieldset>

      <fieldset>
        <legend className="label">Precio (en USD)</legend>
        <div className="grid grid-cols-2 gap-2">
          <input
            aria-label="Precio mínimo en dólares"
            className="field tnum"
            inputMode="numeric"
            placeholder="Mín."
            value={f.precioMin ? miles(+f.precioMin) : ''}
            onChange={(e) => setF({ ...f, precioMin: e.target.value.replace(/\D/g, '') })}
          />
          <input
            aria-label="Precio máximo en dólares"
            className="field tnum"
            inputMode="numeric"
            placeholder="Máx."
            value={f.precioMax ? miles(+f.precioMax) : ''}
            onChange={(e) => setF({ ...f, precioMax: e.target.value.replace(/\D/g, '') })}
          />
        </div>
        <p className="mt-1.5 text-xs text-mute">Los precios en pesos se comparan al dólar de referencia.</p>
      </fieldset>

      <div>
        <label htmlFor={`${id}-km`} className="label">Kilómetros máximos</label>
        <select id={`${id}-km`} className="field tnum" value={f.kmMax} onChange={(e) => setF({ ...f, kmMax: e.target.value })}>
          <option value="">Sin límite</option>
          {KM_OPCIONES.map((k) => (
            <option key={k} value={k}>
              Hasta {miles(k)} km
            </option>
          ))}
        </select>
      </div>

      <fieldset>
        <legend className="label">Combustible</legend>
        <div className="flex flex-wrap gap-2">
          {COMBUSTIBLES.map((c) => (
            <button
              key={c}
              type="button"
              className="chip"
              aria-pressed={f.combustibles.includes(c)}
              onClick={() => setF({ ...f, combustibles: toggle(f.combustibles, c) })}
            >
              {c}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="label">Caja</legend>
        <div className="flex flex-wrap gap-2">
          {CAJAS.map((c) => (
            <button
              key={c}
              type="button"
              className="chip"
              aria-pressed={f.cajas.includes(c)}
              onClick={() => setF({ ...f, cajas: toggle(f.cajas, c) })}
            >
              {c}
            </button>
          ))}
        </div>
      </fieldset>
    </div>
  )
}

function SheetFiltros({
  abierto,
  onCerrar,
  total,
  children,
}: {
  abierto: boolean
  onCerrar: () => void
  total: number
  children: React.ReactNode
}) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (abierto && !d.open) d.showModal()
    if (!abierto && d.open) d.close()
  }, [abierto])

  return (
    <dialog
      ref={ref}
      onClose={onCerrar}
      onClick={(e) => e.target === ref.current && onCerrar()}
      aria-label="Filtros"
      className="m-0 mt-auto max-h-[88svh] w-full max-w-none bg-carbon text-bone backdrop:bg-black/70 open:animate-rise lg:hidden"
    >
      <div className="flex max-h-[88svh] flex-col">
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <span aria-hidden="true" className="absolute top-2 left-1/2 h-1 w-10 -translate-x-1/2 rounded-full bg-line" />
          <p className="font-display text-xl font-semibold uppercase">Filtros</p>
          <button type="button" onClick={onCerrar} className="btn-ghost min-h-11 px-3" aria-label="Cerrar filtros">
            <IconClose size={22} />
          </button>
        </div>
        <div className="overflow-y-auto px-4 py-6">{children}</div>
        <div className="border-t border-line p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <button type="button" onClick={onCerrar} className="btn-accent tnum w-full">
            Ver {total} {total === 1 ? 'auto' : 'autos'}
          </button>
        </div>
      </div>
    </dialog>
  )
}
