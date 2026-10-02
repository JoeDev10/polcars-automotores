export default function Toast({ texto }: { texto: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`pointer-events-none fixed inset-x-4 bottom-24 z-50 mx-auto max-w-sm bg-bone px-4 py-3 text-center text-sm font-semibold text-ink shadow-2xl transition-all duration-300 sm:bottom-8 ${
        texto ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
      }`}
    >
      {texto}
    </div>
  )
}
