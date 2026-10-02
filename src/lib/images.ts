/** Fotos propias en /public/fotos: cada una tiene versión de 1200px y otra de 600px (`-sm`). */
const esLocal = (url: string) => url.startsWith(`${import.meta.env.BASE_URL}fotos/`) && url.endsWith('.jpg')
const chica = (url: string) => url.replace(/\.jpg$/, '-sm.jpg')

/** Pide la foto al ancho justo (Unsplash o fotos propias). Otras URLs y dataURLs quedan igual. */
export function sized(url: string, w: number): string {
  if (esLocal(url)) return w <= 600 ? chica(url) : url
  if (!url.includes('images.unsplash.com')) return url
  return url.replace(/([?&])w=\d+/, `$1w=${w}`)
}

export function srcSet(url: string, widths: number[]): string | undefined {
  if (esLocal(url)) return `${chica(url)} 600w, ${url} 1200w`
  if (!url.includes('images.unsplash.com')) return undefined
  return widths.map((w) => `${sized(url, w)} ${w}w`).join(', ')
}

/**
 * Convierte una foto del celular en un dataURL liviano (máx. 1400px, JPEG),
 * para que entren varias en localStorage durante la demo.
 */
export function comprimir(file: File, max = 1400, calidad = 0.78): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const escala = Math.min(1, max / Math.max(img.width, img.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * escala)
      canvas.height = Math.round(img.height * escala)
      canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL('image/jpeg', calidad))
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('No se pudo leer la imagen'))
    }
    img.src = url
  })
}
