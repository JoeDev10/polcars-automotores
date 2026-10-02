import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import AutoForm from '../components/admin/AutoForm'
import Toast from '../components/Toast'
import {
  IconCar,
  IconEdit,
  IconLock,
  IconLogout,
  IconPlus,
  IconRefresh,
  IconSearch,
  IconSold,
  IconStar,
  IconTrash,
} from '../components/Icons'
import { config } from '../config'
import { useAutos, useDocumentTitle } from '../hooks/useAutos'
import { agencia } from '../lib/agencia'
import { km, precio } from '../lib/format'
import { sized } from '../lib/images'
import { autosRepo } from '../lib/storage'
import type { Auto } from '../types'

const SESION = 'agencia:admin'

export default function Admin() {
  useDocumentTitle(`Panel · ${agencia.nombre}`)
  const [ok, setOk] = useState(() => {
    try {
      return sessionStorage.getItem(SESION) === '1'
    } catch {
      return false
    }
  })

  if (!ok) return <Pin onOk={() => setOk(true)} />
  return (
    <Panel
      onSalir={() => {
        sessionStorage.removeItem(SESION)
        setOk(false)
      }}
    />
  )
}

function Pin({ onOk }: { onOk: () => void }) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)

  function enviar(e: FormEvent) {
    e.preventDefault()
    if (pin === config.adminPin) {
      try {
        sessionStorage.setItem(SESION, '1')
      } catch {
        /* sin storage: solo queda en memoria */
      }
      onOk()
    } else {
      setError(true)
      setPin('')
    }
  }

  return (
    <main className="grid min-h-svh place-items-center px-4">
      <form onSubmit={enviar} className="w-full max-w-sm">
        <span className="grid h-12 w-12 place-items-center bg-carbon-2 text-accent-ink">
          <IconLock size={24} />
        </span>
        <h1 className="mt-6 font-display text-4xl font-bold uppercase leading-none">Panel de {agencia.nombre}</h1>
        <p className="mt-2 text-mute">Ingresá el PIN de 4 números para administrar el stock.</p>

        <label htmlFor="pin" className="label mt-8">PIN</label>
        <input
          id="pin"
          type="password"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={4}
          autoFocus
          value={pin}
          onChange={(e) => {
            setError(false)
            setPin(e.target.value.replace(/\D/g, '').slice(0, 4))
          }}
          aria-invalid={error}
          aria-describedby="pin-ayuda"
          className="field tnum h-16 text-center font-display text-4xl tracking-[0.6em]"
        />
        <p id="pin-ayuda" className={`mt-2 text-sm ${error ? 'text-danger' : 'text-mute'}`} role={error ? 'alert' : undefined}>
          {error ? 'PIN incorrecto. Probá de nuevo.' : 'En la demo el PIN es 1234.'}
        </p>
        <button type="submit" className="btn-accent mt-6 w-full" disabled={pin.length < 4}>
          Entrar
        </button>
        <Link to="/" className="mt-6 inline-block text-sm text-mute underline underline-offset-4 hover:text-bone">
          Volver a la web
        </Link>
      </form>
    </main>
  )
}

type Vista = { tipo: 'lista' } | { tipo: 'form'; auto: Auto | null }

function Panel({ onSalir }: { onSalir: () => void }) {
  const { autos } = useAutos()
  const [vista, setVista] = useState<Vista>({ tipo: 'lista' })
  const [q, setQ] = useState('')
  const [aviso, setAviso] = useState('')

  useEffect(() => {
    if (!aviso) return
    const t = setTimeout(() => setAviso(''), 3000)
    return () => clearTimeout(t)
  }, [aviso])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [vista])

  const lista = useMemo(() => {
    const t = q.trim().toLowerCase()
    return autos.filter((a) => !t || `${a.marca} ${a.modelo} ${a.version} ${a.anio}`.toLowerCase().includes(t))
  }, [autos, q])

  const stats = {
    publicados: autos.filter((a) => !a.vendido).length,
    destacados: autos.filter((a) => a.destacado && !a.vendido).length,
    vendidos: autos.filter((a) => a.vendido).length,
  }

  async function actualizar(a: Auto, cambios: Partial<Auto>, msg: string) {
    await autosRepo.guardar({ ...a, ...cambios })
    setAviso(msg)
  }

  async function eliminar(a: Auto) {
    if (!window.confirm(`¿Eliminar el ${a.marca} ${a.modelo} ${a.anio}? Esta acción no se puede deshacer.`)) return
    await autosRepo.eliminar(a.id)
    setAviso('Auto eliminado')
  }

  if (vista.tipo === 'form') {
    return (
      <AutoForm
        inicial={vista.auto}
        onCancelar={() => setVista({ tipo: 'lista' })}
        onGuardado={(nuevo) => {
          setVista({ tipo: 'lista' })
          setAviso(nuevo ? 'Auto publicado' : 'Cambios guardados')
        }}
      />
    )
  }

  return (
    <div className="min-h-svh pb-28">
      <header className="sticky top-0 z-30 border-b border-line bg-ink/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-4xl items-center gap-3 px-4">
          <span aria-hidden="true" className="h-6 w-1.5 bg-accent" />
          <div className="min-w-0">
            <p className="truncate font-display text-xl leading-none font-bold uppercase">{agencia.nombre}</p>
            <p className="text-xs text-mute">Panel de stock</p>
          </div>
          <Link to="/" className="btn-ghost ml-auto min-h-10 px-3 text-sm">Ver web</Link>
          <button type="button" onClick={onSalir} className="btn-ghost min-h-10 px-3 text-sm" aria-label="Cerrar sesión">
            <IconLogout size={18} /> <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 pt-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h1 className="font-display text-5xl leading-none font-bold uppercase">Tu stock</h1>
          <button type="button" onClick={() => setVista({ tipo: 'form', auto: null })} className="btn-accent hidden sm:inline-flex">
            <IconPlus size={18} /> Cargar auto
          </button>
        </div>

        <dl className="mt-6 grid grid-cols-3 border-y border-line">
          {[
            ['Publicados', stats.publicados],
            ['Destacados', stats.destacados],
            ['Vendidos', stats.vendidos],
          ].map(([k, v], i) => (
            <div key={k} className={`py-4 ${i ? 'border-l border-line pl-4' : ''}`}>
              <dt className="text-xs text-mute">{k}</dt>
              <dd className="tnum font-display text-3xl font-semibold">{v}</dd>
            </div>
          ))}
        </dl>

        <label className="relative mt-6 block">
          <span className="sr-only">Buscar en el stock</span>
          <IconSearch size={20} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-mute" />
          <input type="search" className="field pl-11" placeholder="Buscar auto" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>

        <ul className="mt-5 space-y-3">
          {lista.map((a) => (
            <li key={a.id} className={`bg-carbon ring-1 ring-line ${a.vendido ? 'opacity-70' : ''}`}>
              <div className="flex gap-3 p-3">
                <div className="relative h-20 w-28 shrink-0 overflow-hidden bg-carbon-2">
                  {a.fotos[0] ? (
                    <img src={sized(a.fotos[0], 240)} alt="" className="h-full w-full object-cover" loading="lazy" />
                  ) : (
                    <IconCar size={36} className="m-auto mt-5 text-line" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {a.vendido && <span className="bg-danger/15 px-1.5 py-0.5 text-[0.65rem] font-bold tracking-wider text-danger uppercase">Vendido</span>}
                    {a.destacado && !a.vendido && (
                      <span className="bg-accent/15 px-1.5 py-0.5 text-[0.65rem] font-bold tracking-wider text-accent-ink uppercase">Destacado</span>
                    )}
                  </div>
                  <p className="truncate font-display text-xl leading-tight font-semibold uppercase">
                    {a.marca} {a.modelo}
                  </p>
                  <p className="truncate text-sm text-mute">{a.version}</p>
                  <p className="tnum mt-0.5 text-sm">
                    {a.anio} · {km(a.km)} · <b className="font-semibold whitespace-nowrap">{precio(a.precio, a.moneda)}</b>
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-4 border-t border-line text-xs font-semibold">
                <AccionBtn onClick={() => setVista({ tipo: 'form', auto: a })} icon={<IconEdit size={18} />}>
                  Editar
                </AccionBtn>
                <AccionBtn
                  onClick={() => actualizar(a, { destacado: !a.destacado }, a.destacado ? 'Ya no está destacado' : 'Auto destacado en la portada')}
                  icon={<IconStar size={18} filled={a.destacado} className={a.destacado ? 'text-accent-ink' : ''} />}
                  pressed={a.destacado}
                >
                  {a.destacado ? 'Destacado' : 'Destacar'}
                </AccionBtn>
                <AccionBtn
                  onClick={() => actualizar(a, { vendido: !a.vendido }, a.vendido ? 'Volvió a estar publicado' : 'Marcado como vendido')}
                  icon={<IconSold size={18} />}
                  pressed={a.vendido}
                >
                  {a.vendido ? 'Republicar' : 'Vendido'}
                </AccionBtn>
                <AccionBtn onClick={() => eliminar(a)} icon={<IconTrash size={18} />} peligro>
                  Eliminar
                </AccionBtn>
              </div>
            </li>
          ))}
        </ul>

        {lista.length === 0 && <p className="mt-10 text-center text-mute">No hay autos que coincidan.</p>}

        <button
          type="button"
          className="mt-12 inline-flex items-center gap-2 text-sm text-mute underline underline-offset-4 hover:text-bone"
          onClick={async () => {
            if (window.confirm('¿Volver al stock de ejemplo? Se borran los autos que cargaste.')) {
              await autosRepo.restaurarDemo()
              setAviso('Stock de ejemplo restaurado')
            }
          }}
        >
          <IconRefresh size={16} /> Restaurar datos de ejemplo
        </button>
      </main>

      {/* Botón de carga fijo en el celular */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-ink/95 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur sm:hidden">
        <button type="button" onClick={() => setVista({ tipo: 'form', auto: null })} className="btn-accent w-full">
          <IconPlus size={18} /> Cargar auto
        </button>
      </div>

      <Toast texto={aviso} />
    </div>
  )
}

function AccionBtn({
  onClick,
  icon,
  children,
  pressed,
  peligro,
}: {
  onClick: () => void
  icon: React.ReactNode
  children: React.ReactNode
  pressed?: boolean
  peligro?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={pressed}
      className={`flex min-h-14 flex-col items-center justify-center gap-1 border-l border-line first:border-l-0 transition-colors hover:bg-carbon-2 ${
        peligro ? 'text-danger' : 'text-bone'
      }`}
    >
      {icon}
      {children}
    </button>
  )
}
