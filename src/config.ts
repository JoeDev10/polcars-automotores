/**
 * Configuración de la agencia.
 * Todo lo que cambia de un cliente a otro está acá.
 * El nombre y el WhatsApp también se pueden pisar desde el link: ?n=Nombre&wa=549...
 */
export const config = {
  /** Nombre que se usa si el link no trae ?n= */
  nombre: 'Polcars Automotores',

  /** WhatsApp en formato internacional, sin + ni espacios. Se usa si el link no trae ?wa= */
  whatsapp: '5491131727310',

  zona: 'Quilmes · Zona Sur',
  claim: 'Tu próximo auto empieza acá. Usados seleccionados y 0KM multimarca',

  direccion: {
    calle: 'Av. Urquiza 410, esq. Rep. del Líbano',
    localidad: 'Quilmes, Buenos Aires',
    mapsUrl: 'https://maps.google.com/?q=Av.+Urquiza+410,+Quilmes,+Buenos+Aires',
  },

  // TODO: confirmar horarios con Polcars (no figuran en su Instagram)
  horarios: [
    { dias: 'Lunes a viernes', horas: '9:00 a 19:00' },
    { dias: 'Sábados', horas: '9:00 a 13:30' },
    { dias: 'Domingos', horas: 'Cerrado' },
  ],

  redes: {
    instagram: 'https://www.instagram.com/polcarsautomotores/',
    facebook: 'https://www.facebook.com/polcarsautomotores/',
  },

  /**
   * Colores de marca. El acento se usa poco: botón principal, etiquetas y foco.
   * Cambiá estos valores y toda la web se adapta.
   */
  colores: {
    /** Rojo del logo de Polcars: botones y etiquetas (texto blanco encima, contraste AA) */
    acento: '#E31E24',
    /** Variante más clara para textos e íconos rojos sobre el fondo oscuro (contraste AA) */
    acentoTexto: '#F04A4A',
    textoSobreAcento: '#FFFFFF',
  },

  /** Cotización de referencia para comparar precios en ARS y USD en filtros y orden. */
  cotizacionUSD: 1450,

  /** PIN del panel /admin (solo demo: en producción va contra Supabase Auth). */
  adminPin: '1234',
} as const

export type Config = typeof config
