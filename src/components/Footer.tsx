import { Link } from 'react-router-dom'
import { config } from '../config'
import { agencia, telefonoLegible } from '../lib/agencia'
import { linkWhatsApp, mensajes } from '../lib/whatsapp'
import { IconArrowRight, IconClock, IconPin, IconWhatsApp } from './Icons'

export default function Footer() {
  return (
    <footer id="contacto" className="border-t border-line bg-carbon">
      <div className="mx-auto max-w-7xl px-4 pt-14 pb-28 sm:px-6 lg:pb-14">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="font-display text-4xl font-bold uppercase leading-[0.9] tracking-tight sm:text-5xl">
              {agencia.nombre}
            </p>
            <p className="mt-4 max-w-sm text-mute">Usados seleccionados y 0KM multimarca en Quilmes. Financiación, permuta y consignación.</p>
            <a
              href={linkWhatsApp(mensajes.general())}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-accent mt-6"
            >
              <IconWhatsApp size={18} /> {telefonoLegible(agencia.whatsapp)}
            </a>
          </div>

          <div className="md:col-span-4">
            <h2 className="eyebrow flex items-center gap-2">
              <IconPin size={16} /> Ubicación
            </h2>
            <address className="mt-3 not-italic leading-relaxed">
              {config.direccion.calle}
              <br />
              <span className="text-mute">{config.direccion.localidad}</span>
            </address>
            <a
              href={config.direccion.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold underline-offset-4 hover:underline"
            >
              Cómo llegar <IconArrowRight size={16} />
            </a>

            <h2 className="eyebrow mt-8 flex items-center gap-2">
              <IconClock size={16} /> Horarios
            </h2>
            <dl className="mt-3 space-y-1.5 text-sm">
              {config.horarios.map((h) => (
                <div key={h.dias} className="flex justify-between gap-4 border-b border-line/60 pb-1.5">
                  <dt className="text-mute">{h.dias}</dt>
                  <dd className="tnum">{h.horas}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="md:col-span-3">
            <h2 className="eyebrow">Redes</h2>
            <ul className="mt-3 space-y-2">
              <li>
                <a href={config.redes.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-accent-ink">
                  Instagram
                </a>
              </li>
              <li>
                <a href={config.redes.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-accent-ink">
                  Facebook
                </a>
              </li>
              <li>
                <a href={linkWhatsApp(mensajes.general())} target="_blank" rel="noopener noreferrer" className="hover:text-accent-ink">
                  WhatsApp
                </a>
              </li>
            </ul>
            <h2 className="eyebrow mt-8">Sitio</h2>
            <ul className="mt-3 space-y-2">
              <li><Link to="/stock" className="hover:text-accent-ink">Stock completo</Link></li>
              <li><Link to="/#vender" className="hover:text-accent-ink">Vendé o permutá tu auto</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-line pt-6 text-xs text-mute sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} {agencia.nombre}. Precios sujetos a cambio sin previo aviso.</p>
          <Link to="/admin" className="hover:text-bone">Acceso agencia</Link>
        </div>
      </div>
    </footer>
  )
}
