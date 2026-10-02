import { Link, NavLink } from 'react-router-dom'
import { agencia } from '../lib/agencia'
import { linkWhatsApp, mensajes } from '../lib/whatsapp'
import { IconWhatsApp } from './Icons'

const navClass = ({ isActive }: { isActive: boolean }) =>
  `relative py-2 text-sm font-medium transition-colors hover:text-bone ${
    isActive ? 'text-bone after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:bg-accent' : 'text-mute'
  }`

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-ink/85 backdrop-blur-md supports-[backdrop-filter]:bg-ink/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6">
        <Link to="/" className="group flex min-w-0 items-center gap-2.5" aria-label={`${agencia.nombre}, inicio`}>
          <span aria-hidden="true" className="h-6 w-1.5 shrink-0 bg-accent transition-transform duration-300 group-hover:scale-y-125" />
          <span className="truncate font-display text-xl font-bold uppercase leading-none tracking-wide sm:text-2xl">
            {agencia.nombre}
          </span>
        </Link>

        <nav aria-label="Principal" className="ml-auto flex items-center gap-5 sm:gap-7">
          <NavLink to="/stock" className={navClass}>
            Stock
          </NavLink>
          <Link to="/#vender" className="hidden py-2 text-sm font-medium text-mute transition-colors hover:text-bone sm:inline">
            Vendé tu auto
          </Link>
          <a href="#contacto" className="hidden py-2 text-sm font-medium text-mute transition-colors hover:text-bone md:inline">
            Contacto
          </a>
          <a
            href={linkWhatsApp(mensajes.general())}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline min-h-10 gap-2 px-3 text-sm sm:px-4"
          >
            <IconWhatsApp size={18} />
            <span className="hidden sm:inline">WhatsApp</span>
            <span className="sr-only sm:hidden">Escribinos por WhatsApp</span>
          </a>
        </nav>
      </div>
    </header>
  )
}
