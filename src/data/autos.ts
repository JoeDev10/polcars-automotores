import type { Auto } from '../types'

/**
 * Stock inicial: autos publicados en el Instagram de Polcars (@polcarsautomotores).
 * Las fotos están en /public/fotos/<auto>/ (la primera es la portada), con una
 * versión de 1200px y otra de 600px (`-sm`) que elige `sized()` según el ancho.
 *
 * Instagram no publica precios: `precio: 0` se muestra como "Consultar".
 * TODO: confirmar con Polcars precio, VTV y cantidad de dueños de cada auto.
 */
const fotos = (carpeta: string, cantidad: number) =>
  Array.from({ length: cantidad }, (_, i) => `${import.meta.env.BASE_URL}fotos/${carpeta}/${String(i + 1).padStart(2, '0')}.jpg`)

export const autosIniciales: Auto[] = [
  {
    id: 'peugeot-308-feline-2019',
    marca: 'Peugeot',
    modelo: '308',
    version: '1.6 HDi Feline',
    anio: 2019,
    km: 108000,
    precio: 0,
    moneda: 'ARS',
    combustible: 'Diésel',
    caja: 'Manual',
    carroceria: 'Hatchback',
    motor: '1.6 HDi',
    color: 'Gris plata',
    puertas: 5,
    vtv: true,
    duenos: 1,
    fotos: fotos('peugeot-308-feline-2019', 10),
    etiqueta: 'Recién ingresado',
    descripcion: 'Tapizado de cuero, techo panorámico y pantalla multimedia. Consultá por financiación y permuta.',
    destacado: true,
    vendido: false,
    creadoEn: '2026-09-23',
  },
  {
    id: 'peugeot-208-allure-2014',
    marca: 'Peugeot',
    modelo: '208',
    version: '1.5 Allure',
    anio: 2014,
    km: 145000,
    precio: 0,
    moneda: 'ARS',
    combustible: 'Nafta',
    caja: 'Manual',
    carroceria: 'Hatchback',
    motor: '1.5 nafta',
    color: 'Blanco',
    puertas: 5,
    vtv: true,
    duenos: 1,
    fotos: fotos('peugeot-208-allure-2014', 10),
    etiqueta: 'Recién ingresado',
    descripcion: 'Anticipo mínimo de $9.100.000 y el resto lo financiás en las cuotas que quieras. Consultanos y te enviamos tu cotización.',
    destacado: true,
    vendido: false,
    creadoEn: '2026-09-27',
  },
  {
    id: 'ford-focus-trend-2013',
    marca: 'Ford',
    modelo: 'Focus',
    version: '1.6 Trend Exe',
    anio: 2013,
    km: 162000,
    precio: 0,
    moneda: 'ARS',
    combustible: 'GNC',
    caja: 'Manual',
    carroceria: 'Sedán',
    motor: '1.6 nafta/GNC',
    color: 'Gris oscuro',
    puertas: 4,
    vtv: true,
    duenos: 1,
    fotos: fotos('ford-focus-trend-2013', 10),
    etiqueta: 'Oportunidad',
    descripcion: 'Nafta y GNC, impecable. Retiralo con un anticipo de $6.300.000 y el resto en las cuotas que quieras.',
    destacado: true,
    vendido: false,
    creadoEn: '2026-09-25',
  },
]

/** Fotos para el hero de la home y el bloque de venta (local de Polcars en Quilmes). */
export const fotosSitio = {
  hero: `${import.meta.env.BASE_URL}fotos/peugeot-308-feline-2019/02.jpg`,
  vender: `${import.meta.env.BASE_URL}fotos/ford-focus-trend-2013/03.jpg`,
}
