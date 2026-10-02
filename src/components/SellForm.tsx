import { useId, useState, type FormEvent } from 'react'
import { fotosSitio } from '../data/autos'
import { sized } from '../lib/images'
import { linkWhatsApp, mensajes } from '../lib/whatsapp'
import { IconWhatsApp } from './Icons'

const anioActual = new Date().getFullYear()
const anios = Array.from({ length: 30 }, (_, i) => anioActual - i)

export default function SellForm() {
  const id = useId()
  const [operacion, setOperacion] = useState<'vender' | 'permutar'>('permutar')
  const [d, setD] = useState({ marca: '', modelo: '', anio: '', km: '' })
  const [error, setError] = useState('')

  const set = (k: keyof typeof d) => (e: { target: { value: string } }) => setD({ ...d, [k]: e.target.value })

  function enviar(e: FormEvent) {
    e.preventDefault()
    if (!d.marca.trim() || !d.modelo.trim() || !d.anio) {
      setError('Completá marca, modelo y año para poder cotizarlo.')
      return
    }
    setError('')
    const kmFmt = d.km ? Number(d.km.replace(/\D/g, '')).toLocaleString('es-AR') : ''
    window.open(linkWhatsApp(mensajes.vender({ ...d, km: kmFmt, operacion })), '_blank', 'noopener')
  }

  return (
    <section id="vender" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
      <div className="grid overflow-hidden bg-carbon ring-1 ring-line lg:grid-cols-12">
        <div className="relative min-h-64 lg:col-span-5">
          <img
            src={sized(fotosSitio.vender, 1100)}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-carbon via-carbon/40 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-carbon/20 lg:to-carbon" />
        </div>

        <div className="relative px-5 py-10 sm:px-10 lg:col-span-7 lg:py-14">
          <p className="eyebrow">Compramos y permutamos</p>
          <h2 className="mt-2 font-display text-[2.6rem] font-bold uppercase leading-[0.92] tracking-tight sm:text-6xl">
            ¿Querés vender o<br /> permutar tu auto?
          </h2>
          <p className="mt-4 max-w-md text-mute">Contanos qué tenés y te pasamos una cotización por WhatsApp. Sin compromiso.</p>

          <form onSubmit={enviar} noValidate className="mt-8 grid gap-4 sm:grid-cols-2">
            <fieldset className="sm:col-span-2">
              <legend className="label">Quiero</legend>
              <div className="inline-flex rounded-full border border-line p-1">
                {(['permutar', 'vender'] as const).map((op) => (
                  <button
                    key={op}
                    type="button"
                    aria-pressed={operacion === op}
                    onClick={() => setOperacion(op)}
                    className={`min-h-10 rounded-full px-5 text-sm font-semibold capitalize transition-colors ${
                      operacion === op ? 'bg-bone text-ink' : 'text-mute hover:text-bone'
                    }`}
                  >
                    {op}
                  </button>
                ))}
              </div>
            </fieldset>

            <div>
              <label htmlFor={`${id}-marca`} className="label">Marca</label>
              <input id={`${id}-marca`} className="field" placeholder="Ej: Volkswagen" value={d.marca} onChange={set('marca')} autoComplete="off" />
            </div>
            <div>
              <label htmlFor={`${id}-modelo`} className="label">Modelo</label>
              <input id={`${id}-modelo`} className="field" placeholder="Ej: Suran 1.6 Highline" value={d.modelo} onChange={set('modelo')} autoComplete="off" />
            </div>
            <div>
              <label htmlFor={`${id}-anio`} className="label">Año</label>
              <select id={`${id}-anio`} className="field" value={d.anio} onChange={set('anio')}>
                <option value="">Elegí el año</option>
                {anios.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor={`${id}-km`} className="label">Kilómetros</label>
              <input
                id={`${id}-km`}
                className="field tnum"
                inputMode="numeric"
                placeholder="Ej: 85.000"
                value={d.km}
                onChange={(e) => {
                  const n = e.target.value.replace(/\D/g, '').slice(0, 7)
                  setD({ ...d, km: n ? Number(n).toLocaleString('es-AR') : '' })
                }}
              />
            </div>

            <div className="sm:col-span-2">
              {error && (
                <p role="alert" className="mb-3 text-sm text-danger">{error}</p>
              )}
              <button type="submit" className="btn-accent w-full sm:w-auto">
                <IconWhatsApp size={18} /> Pedir cotización por WhatsApp
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
