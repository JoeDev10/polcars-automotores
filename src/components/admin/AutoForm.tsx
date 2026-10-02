import { useId, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { miles, precio as fmtPrecio } from '../../lib/format'
import { comprimir, sized } from '../../lib/images'
import { autosRepo, nuevoId, StorageLlenoError } from '../../lib/storage'
import {
  CAJAS,
  CARROCERIAS,
  COMBUSTIBLES,
  ETIQUETAS,
  type Auto,
  type Caja,
  type Carroceria,
  type Combustible,
  type Etiqueta,
  type Moneda,
} from '../../types'
import { IconArrowLeft, IconCamera, IconChevronLeft, IconChevronRight, IconClose, IconLink } from '../Icons'

const MARCAS = [
  'Chevrolet', 'Citroën', 'Fiat', 'Ford', 'Honda', 'Hyundai', 'Jeep', 'Nissan',
  'Peugeot', 'Renault', 'Toyota', 'Volkswagen',
]
const anioActual = new Date().getFullYear()
const ANIOS = Array.from({ length: 35 }, (_, i) => anioActual + 1 - i)

type Borrador = Omit<Auto, 'anio' | 'km' | 'precio' | 'puertas' | 'duenos'> & {
  anio: string
  km: string
  precio: string
  puertas: string
  duenos: string
}

function aBorrador(a: Auto | null): Borrador {
  if (!a) {
    return {
      id: '',
      marca: '',
      modelo: '',
      version: '',
      anio: '',
      km: '',
      precio: '',
      moneda: 'USD',
      combustible: 'Nafta',
      caja: 'Manual',
      carroceria: 'Sedán',
      motor: '',
      color: '',
      puertas: '4',
      vtv: true,
      duenos: '1',
      fotos: [],
      etiqueta: 'Recién ingresado',
      descripcion: '',
      destacado: false,
      vendido: false,
      creadoEn: '',
    }
  }
  return {
    ...a,
    anio: String(a.anio),
    km: String(a.km),
    precio: String(a.precio),
    puertas: String(a.puertas),
    duenos: String(a.duenos),
  }
}

export default function AutoForm({
  inicial,
  onCancelar,
  onGuardado,
}: {
  inicial: Auto | null
  onCancelar: () => void
  onGuardado: (nuevo: boolean) => void
}) {
  const id = useId()
  const [b, setB] = useState<Borrador>(() => aBorrador(inicial))
  const [errores, setErrores] = useState<Record<string, string>>({})
  const [errorGeneral, setErrorGeneral] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [subiendo, setSubiendo] = useState(false)
  const [urlFoto, setUrlFoto] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const set = <K extends keyof Borrador>(k: K, v: Borrador[K]) => {
    setB((prev) => ({ ...prev, [k]: v }))
    if (errores[k as string]) setErrores((e) => ({ ...e, [k]: '' }))
  }
  const soloNumeros = (v: string, max = 10) => v.replace(/\D/g, '').slice(0, max)

  async function agregarArchivos(files: FileList | null) {
    if (!files?.length) return
    setSubiendo(true)
    try {
      const nuevas = await Promise.all([...files].slice(0, 12).map((f) => comprimir(f)))
      setB((prev) => ({ ...prev, fotos: [...prev.fotos, ...nuevas] }))
      setErrores((e) => ({ ...e, fotos: '' }))
    } catch {
      setErrorGeneral('Una de las fotos no se pudo leer. Probá con otra.')
    } finally {
      setSubiendo(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  function agregarUrl() {
    const u = urlFoto.trim()
    if (!/^https?:\/\/\S+$/i.test(u)) {
      setErrores((e) => ({ ...e, urlFoto: 'Pegá un link que empiece con http:// o https://' }))
      return
    }
    setB((prev) => ({ ...prev, fotos: [...prev.fotos, u] }))
    setUrlFoto('')
    setErrores((e) => ({ ...e, urlFoto: '', fotos: '' }))
  }

  function moverFoto(i: number, dir: -1 | 1) {
    setB((prev) => {
      const f = [...prev.fotos]
      const j = i + dir
      if (j < 0 || j >= f.length) return prev
      ;[f[i], f[j]] = [f[j], f[i]]
      return { ...prev, fotos: f }
    })
  }

  function validar() {
    const e: Record<string, string> = {}
    if (!b.marca.trim()) e.marca = 'Escribí la marca'
    if (!b.modelo.trim()) e.modelo = 'Escribí el modelo'
    if (!b.anio) e.anio = 'Elegí el año'
    if (b.km === '') e.km = 'Poné los kilómetros (0 si es 0 km)'
    if (!b.precio || +b.precio <= 0) e.precio = 'Poné el precio'
    if (!b.fotos.length) e.fotos = 'Agregá al menos una foto'
    setErrores(e)
    return Object.keys(e).length === 0
  }

  async function guardar(ev: FormEvent) {
    ev.preventDefault()
    setErrorGeneral('')
    if (!validar()) {
      setErrorGeneral('Revisá los campos marcados en rojo.')
      return
    }
    setGuardando(true)
    const auto: Auto = {
      ...b,
      id: b.id || nuevoId(b.marca, b.modelo, +b.anio),
      marca: b.marca.trim(),
      modelo: b.modelo.trim(),
      version: b.version.trim(),
      anio: +b.anio,
      km: +b.km,
      precio: +b.precio,
      puertas: +b.puertas || 4,
      duenos: +b.duenos || 1,
      etiqueta: b.etiqueta || null,
      creadoEn: b.creadoEn || new Date().toISOString().slice(0, 10),
    }
    try {
      await autosRepo.guardar(auto)
      onGuardado(!inicial)
    } catch (e) {
      setErrorGeneral(e instanceof StorageLlenoError ? e.message : 'No se pudo guardar. Probá de nuevo.')
      setGuardando(false)
    }
  }

  return (
    <div className="min-h-svh pb-32">
      <header className="sticky top-0 z-30 border-b border-line bg-ink/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-3xl items-center gap-2 px-2 sm:px-4">
          <button type="button" onClick={onCancelar} className="btn-ghost min-h-11 px-3" aria-label="Volver al listado">
            <IconArrowLeft size={20} />
          </button>
          <h1 className="font-display text-2xl leading-none font-bold uppercase">{inicial ? 'Editar auto' : 'Cargar auto'}</h1>
        </div>
      </header>

      <form id={`${id}-form`} onSubmit={guardar} noValidate className="mx-auto max-w-3xl space-y-4 px-4 pt-6">
        {/* FOTOS primero: es lo que más tiempo lleva y lo que más vende */}
        <Seccion titulo="Fotos" ayuda="La primera foto es la portada. Usá las flechas para cambiar el orden.">
          {b.fotos.length > 0 && (
            <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {b.fotos.map((src, i) => (
                <li key={src.slice(-40) + i} className="relative aspect-[4/3] overflow-hidden bg-carbon-2">
                  <img src={sized(src, 400)} alt={`Foto ${i + 1}`} className="h-full w-full object-cover" />
                  {i === 0 && (
                    <span className="absolute top-1.5 left-1.5 bg-accent px-1.5 py-0.5 text-[0.65rem] font-bold tracking-wider text-on-accent uppercase">
                      Portada
                    </span>
                  )}
                  <div className="absolute inset-x-0 bottom-0 flex justify-between bg-gradient-to-t from-black/80 to-transparent p-1.5 pt-6">
                    <div className="flex gap-1">
                      <MiniBtn label="Mover a la izquierda" onClick={() => moverFoto(i, -1)} disabled={i === 0}>
                        <IconChevronLeft size={18} />
                      </MiniBtn>
                      <MiniBtn label="Mover a la derecha" onClick={() => moverFoto(i, 1)} disabled={i === b.fotos.length - 1}>
                        <IconChevronRight size={18} />
                      </MiniBtn>
                    </div>
                    <MiniBtn label={`Quitar foto ${i + 1}`} onClick={() => set('fotos', b.fotos.filter((_, j) => j !== i))}>
                      <IconClose size={18} />
                    </MiniBtn>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <input
            ref={fileRef}
            id={`${id}-files`}
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={(e) => agregarArchivos(e.target.files)}
          />
          <label
            htmlFor={`${id}-files`}
            className={`mt-3 flex min-h-24 cursor-pointer flex-col items-center justify-center gap-1.5 border border-dashed px-4 py-5 text-center transition-colors hover:border-accent has-[:focus-visible]:outline-2 ${
              errores.fotos ? 'border-danger' : 'border-line'
            }`}
          >
            <IconCamera size={28} className="text-accent-ink" />
            <span className="font-semibold">{subiendo ? 'Procesando fotos…' : 'Sacar o elegir fotos'}</span>
            <span className="text-xs text-mute">Desde la galería o la cámara del celular</span>
          </label>
          {errores.fotos && <p className="mt-2 text-sm text-danger">{errores.fotos}</p>}

          <div className="mt-4">
            <label htmlFor={`${id}-url`} className="label">O pegá el link de una foto</label>
            <div className="flex gap-2">
              <input
                id={`${id}-url`}
                type="url"
                inputMode="url"
                className="field"
                placeholder="https://…"
                value={urlFoto}
                onChange={(e) => setUrlFoto(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    agregarUrl()
                  }
                }}
              />
              <button type="button" onClick={agregarUrl} className="btn-outline shrink-0 px-4">
                <IconLink size={18} /> Agregar
              </button>
            </div>
            {errores.urlFoto && <p className="mt-2 text-sm text-danger">{errores.urlFoto}</p>}
          </div>
        </Seccion>

        <Seccion titulo="Datos principales">
          <div className="grid gap-4 sm:grid-cols-2">
            <Campo label="Marca" id={`${id}-marca`} error={errores.marca}>
              <input
                id={`${id}-marca`}
                className="field"
                list={`${id}-marcas`}
                placeholder="Ej: Toyota"
                value={b.marca}
                onChange={(e) => set('marca', e.target.value)}
                autoCapitalize="words"
              />
              <datalist id={`${id}-marcas`}>
                {MARCAS.map((m) => (
                  <option key={m} value={m} />
                ))}
              </datalist>
            </Campo>
            <Campo label="Modelo" id={`${id}-modelo`} error={errores.modelo}>
              <input id={`${id}-modelo`} className="field" placeholder="Ej: Corolla" value={b.modelo} onChange={(e) => set('modelo', e.target.value)} />
            </Campo>
            <Campo label="Versión" id={`${id}-version`} opcional className="sm:col-span-2">
              <input id={`${id}-version`} className="field" placeholder="Ej: 2.0 XEi CVT" value={b.version} onChange={(e) => set('version', e.target.value)} />
            </Campo>
            <Campo label="Año" id={`${id}-anio`} error={errores.anio}>
              <select id={`${id}-anio`} className="field tnum" value={b.anio} onChange={(e) => set('anio', e.target.value)}>
                <option value="">Elegí</option>
                {ANIOS.map((a) => (
                  <option key={a}>{a}</option>
                ))}
              </select>
            </Campo>
            <Campo label="Kilómetros" id={`${id}-km`} error={errores.km}>
              <input
                id={`${id}-km`}
                className="field tnum"
                inputMode="numeric"
                placeholder="Ej: 85.000"
                value={b.km ? miles(+b.km) : ''}
                onChange={(e) => set('km', soloNumeros(e.target.value, 7))}
              />
            </Campo>
            <Campo label="Tipo de vehículo" id={`${id}-carroceria`} className="sm:col-span-2">
              <Opciones
                nombre="Tipo de vehículo"
                opciones={CARROCERIAS}
                valor={b.carroceria}
                onChange={(v) => set('carroceria', v as Carroceria)}
              />
            </Campo>
          </div>
        </Seccion>

        <Seccion titulo="Precio">
          <div className="grid gap-4 sm:grid-cols-[auto_1fr] sm:items-start">
            <Campo label="Moneda" id={`${id}-moneda`}>
              <Opciones
                nombre="Moneda"
                opciones={['USD', 'ARS']}
                etiquetas={{ USD: 'Dólares', ARS: 'Pesos' }}
                valor={b.moneda}
                onChange={(v) => set('moneda', v as Moneda)}
              />
            </Campo>
            <Campo label="Precio" id={`${id}-precio`} error={errores.precio}>
              <div className="relative">
                <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 font-semibold text-mute">
                  {b.moneda === 'USD' ? 'USD' : '$'}
                </span>
                <input
                  id={`${id}-precio`}
                  className={`field tnum font-display text-2xl font-semibold ${b.moneda === 'USD' ? 'pl-14' : 'pl-8'}`}
                  inputMode="numeric"
                  placeholder="0"
                  value={b.precio ? miles(+b.precio) : ''}
                  onChange={(e) => set('precio', soloNumeros(e.target.value, 11))}
                />
              </div>
              {b.precio && <p className="tnum mt-1.5 text-sm text-mute">Se publica como: <b className="text-bone">{fmtPrecio(+b.precio, b.moneda)}</b></p>}
            </Campo>
          </div>
        </Seccion>

        <Seccion titulo="Ficha técnica">
          <div className="grid gap-4 sm:grid-cols-2">
            <Campo label="Motor" id={`${id}-motor`} opcional>
              <input id={`${id}-motor`} className="field" placeholder="Ej: 1.6 110 CV" value={b.motor} onChange={(e) => set('motor', e.target.value)} />
            </Campo>
            <Campo label="Color" id={`${id}-color`} opcional>
              <input id={`${id}-color`} className="field" placeholder="Ej: Gris plata" value={b.color} onChange={(e) => set('color', e.target.value)} />
            </Campo>
            <Campo label="Combustible" id={`${id}-comb`} className="sm:col-span-2">
              <Opciones nombre="Combustible" opciones={COMBUSTIBLES} valor={b.combustible} onChange={(v) => set('combustible', v as Combustible)} />
            </Campo>
            <Campo label="Caja" id={`${id}-caja`}>
              <Opciones nombre="Caja" opciones={CAJAS} valor={b.caja} onChange={(v) => set('caja', v as Caja)} />
            </Campo>
            <Campo label="VTV" id={`${id}-vtv`}>
              <Opciones
                nombre="VTV"
                opciones={['si', 'no']}
                etiquetas={{ si: 'Vigente', no: 'A realizar' }}
                valor={b.vtv ? 'si' : 'no'}
                onChange={(v) => set('vtv', v === 'si')}
              />
            </Campo>
            <Campo label="Puertas" id={`${id}-puertas`}>
              <Opciones nombre="Puertas" opciones={['2', '3', '4', '5']} valor={b.puertas} onChange={(v) => set('puertas', v)} />
            </Campo>
            <Campo label="Cantidad de dueños" id={`${id}-duenos`}>
              <Opciones nombre="Cantidad de dueños" opciones={['1', '2', '3', '4']} etiquetas={{ '4': '4 o más' }} valor={b.duenos} onChange={(v) => set('duenos', v)} />
            </Campo>
          </div>
        </Seccion>

        <Seccion titulo="Publicación">
          <div className="grid gap-4">
            <Campo label="Etiqueta en la foto" id={`${id}-etiqueta`}>
              <Opciones
                nombre="Etiqueta"
                opciones={['', ...ETIQUETAS]}
                etiquetas={{ '': 'Ninguna' }}
                valor={b.etiqueta ?? ''}
                onChange={(v) => set('etiqueta', (v || null) as Etiqueta | null)}
              />
            </Campo>
            <label className="flex min-h-14 cursor-pointer items-center justify-between gap-4 border border-line px-4">
              <span>
                <span className="block font-semibold">Destacar en la portada</span>
                <span className="text-sm text-mute">Aparece entre los 6 autos de la home</span>
              </span>
              <input
                type="checkbox"
                checked={b.destacado}
                onChange={(e) => set('destacado', e.target.checked)}
                className="h-6 w-6 shrink-0 accent-[var(--color-accent)]"
              />
            </label>
            <Campo label="Descripción" id={`${id}-desc`} opcional>
              <textarea
                id={`${id}-desc`}
                rows={4}
                className="field py-3"
                placeholder="Ej: Único dueño, service al día, cubiertas nuevas."
                value={b.descripcion ?? ''}
                onChange={(e) => set('descripcion', e.target.value)}
              />
            </Campo>
          </div>
        </Seccion>
      </form>

      {/* Barra de guardado fija */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-ink/95 backdrop-blur">
        <div className="mx-auto max-w-3xl p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {errorGeneral && (
            <p role="alert" className="mb-3 text-sm text-danger">{errorGeneral}</p>
          )}
          <div className="flex gap-3">
            <button type="button" onClick={onCancelar} className="btn-outline">
              Cancelar
            </button>
            <button type="submit" form={`${id}-form`} disabled={guardando || subiendo} className="btn-accent flex-1">
              {guardando ? 'Guardando…' : inicial ? 'Guardar cambios' : 'Publicar auto'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Seccion({ titulo, ayuda, children }: { titulo: string; ayuda?: string; children: ReactNode }) {
  return (
    <fieldset className="bg-carbon p-4 ring-1 ring-line sm:p-6">
      <legend className="sr-only">{titulo}</legend>
      <h2 aria-hidden="true" className="font-display text-2xl font-semibold uppercase">{titulo}</h2>
      {ayuda && <p className="mt-1 text-sm text-mute">{ayuda}</p>}
      <div className="mt-4">{children}</div>
    </fieldset>
  )
}

function Campo({
  label,
  id,
  error,
  opcional,
  className = '',
  children,
}: {
  label: string
  id: string
  error?: string
  opcional?: boolean
  className?: string
  children: ReactNode
}) {
  return (
    <div className={`${className} ${error ? '[&_.field]:border-danger' : ''}`}>
      <label htmlFor={id} className="label">
        {label} {opcional && <span className="font-normal text-mute/70">(opcional)</span>}
      </label>
      {children}
      {error && <p className="mt-1.5 text-sm text-danger">{error}</p>}
    </div>
  )
}

/** Botones grandes en lugar de selects: más fáciles de tocar en el celular. */
function Opciones({
  nombre,
  opciones,
  valor,
  onChange,
  etiquetas = {},
}: {
  nombre: string
  opciones: readonly string[]
  valor: string
  onChange: (v: string) => void
  etiquetas?: Record<string, string>
}) {
  return (
    <div role="radiogroup" aria-label={nombre} className="flex flex-wrap gap-2">
      {opciones.map((o) => (
        <button
          key={o}
          type="button"
          role="radio"
          aria-checked={valor === o}
          onClick={() => onChange(o)}
          className={`min-h-11 rounded-md border px-4 text-sm font-semibold transition-colors ${
            valor === o ? 'border-accent bg-accent text-on-accent' : 'border-line text-bone hover:border-mute'
          }`}
        >
          {etiquetas[o] ?? o}
        </button>
      ))}
    </div>
  )
}

function MiniBtn({ label, onClick, disabled, children }: { label: string; onClick: () => void; disabled?: boolean; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="grid h-9 w-9 place-items-center rounded-full bg-ink/80 text-bone backdrop-blur transition-opacity hover:bg-ink disabled:opacity-30"
    >
      {children}
    </button>
  )
}
