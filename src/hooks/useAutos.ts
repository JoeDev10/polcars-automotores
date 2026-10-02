import { useEffect, useState } from 'react'
import { autosRepo, suscribir } from '../lib/storage'
import type { Auto } from '../types'

export function useAutos() {
  const [autos, setAutos] = useState<Auto[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    let vivo = true
    const cargar = () =>
      autosRepo.listar().then((a) => {
        if (vivo) {
          setAutos(a)
          setCargando(false)
        }
      })
    cargar()
    const off = suscribir(cargar)
    return () => {
      vivo = false
      off()
    }
  }, [])

  return { autos, cargando }
}

export function useDocumentTitle(titulo: string) {
  useEffect(() => {
    document.title = titulo
  }, [titulo])
}
