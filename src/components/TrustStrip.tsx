import { IconCar, IconCard, IconShield, IconSwap } from './Icons'

const items = [
  { icon: IconShield, titulo: 'Usados seleccionados', texto: 'Unidades revisadas y con papeles al día.' },
  { icon: IconCar, titulo: '0KM multimarca', texto: 'Conseguimos el modelo nuevo que buscás, de cualquier marca.' },
  { icon: IconCard, titulo: 'Financiación', texto: 'Planes en cuotas adaptados a tu presupuesto.' },
  { icon: IconSwap, titulo: 'Permuta y consignación', texto: 'Tomamos tu usado o lo vendemos por vos.' },
]

export default function TrustStrip() {
  return (
    <section aria-label="Por qué elegirnos" className="border-y border-line bg-carbon">
      <ul className="mx-auto grid max-w-7xl grid-cols-2 lg:grid-cols-4">
        {items.map(({ icon: Icon, titulo, texto }, i) => (
          <li
            key={titulo}
            className={`flex flex-col gap-3 px-4 py-6 sm:flex-row sm:items-start sm:gap-4 sm:px-6 sm:py-8 ${
              i % 2 === 1 ? 'border-l border-line' : ''
            } ${i >= 2 ? 'border-t border-line lg:border-t-0' : ''} ${i === 2 ? 'lg:border-l' : ''}`}
          >
            <Icon size={26} className="shrink-0 text-accent-ink" />
            <div>
              <h3 className="font-display text-lg font-semibold uppercase leading-tight tracking-wide sm:text-xl">{titulo}</h3>
              <p className="mt-1 text-sm leading-snug text-mute">{texto}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
