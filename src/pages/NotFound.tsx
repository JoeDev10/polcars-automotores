import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6">
      <p className="eyebrow">Error 404</p>
      <h1 className="mt-2 font-display text-6xl font-bold uppercase leading-none">Página no encontrada</h1>
      <p className="mt-3 text-mute">El link puede estar mal escrito o la página ya no existe.</p>
      <Link to="/" className="btn-accent mt-8">Ir al inicio</Link>
    </div>
  )
}
