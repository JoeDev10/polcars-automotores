# Web demo para agencias de autos usados

Prototipo de web para concesionarias de zona sur (GBA). Hecho con Vite, React, TypeScript y Tailwind.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # genera /dist
```

## 1. Cambiar los datos de la agencia

Todo está en **`src/config.ts`**:

| Campo | Qué es |
|---|---|
| `nombre` | Nombre por defecto (si el link no trae `?n=`) |
| `whatsapp` | Número por defecto, formato `549` + código de área + número, sin `+` ni espacios |
| `direccion`, `horarios`, `redes` | Se muestran en el footer |
| `colores.acento` | Color de los botones y las etiquetas. Cambialo y toda la web se adapta |
| `cotizacionUSD` | Dólar de referencia para comparar precios en pesos y en dólares en los filtros |
| `adminPin` | PIN del panel (`1234` en la demo) |

## 2. Link personalizado para cada concesionaria

Sumale parámetros a la URL:

```
https://tu-demo.vercel.app/?n=Tresa%20Autos&wa=5491140581259
```

- `n` → nombre de la agencia. Cambia el header, el título de la pestaña, el hero y los mensajes de WhatsApp. Los espacios van como `%20`.
- `wa` → número de WhatsApp (opcional).
- Sin parámetros se muestra **"Agencia Demo"**.

Los datos se mantienen mientras la persona navega el sitio, y el botón "Compartir" de cada auto los agrega al link para que quien lo reciba vea la misma agencia.

## 3. Cargar autos

**Desde el panel (lo recomendado):** entrá a `/admin`, poné el PIN y tocá **Cargar auto**. Ahí podés:
- Subir fotos desde el celular (se comprimen solas) o pegar links. La primera foto es la portada.
- Editar, destacar en la portada, marcar como vendido o eliminar cada auto.

En esta demo lo que cargás se guarda **solo en ese navegador** (localStorage). Con "Restaurar datos de ejemplo" volvés al stock original.

**Desde el código:** el stock inicial está en `src/data/autos.ts`. Para usar las fotos reales del cliente, reemplazá las URLs de `fotos`.

### Pasar a Supabase más adelante
Toda la app lee y guarda a través de `src/lib/storage.ts` (`autosRepo`). Para usar Supabase, escribí otra implementación de la interfaz `AutosRepo` (listar, obtener, guardar, eliminar) y exportala en lugar de `localRepo`. No hace falta tocar las páginas.

## 4. Subir a Vercel

**Opción A, desde la web:** subí la carpeta a un repo de GitHub, entrá a [vercel.com/new](https://vercel.com/new) e importalo. Vercel detecta Vite solo (build `npm run build`, salida `dist`).

**Opción B, desde la terminal:**
```bash
npm i -g vercel
vercel          # la primera vez te pide loguearte
vercel --prod
```

El archivo `vercel.json` ya está configurado para que funcionen los links directos (`/stock`, `/auto/...`, `/admin`).

## Notas
- Las fotos son del Instagram de Polcars (@polcarsautomotores) y están en `public/fotos/<auto>/`, cada una en 1200px y 600px (`-sm`). Para sumar un auto desde el código, creá su carpeta con `01.jpg`, `01-sm.jpg`, etc.
- El PIN del panel es solo para la demo: no es seguridad real. En producción, usar Supabase Auth.

## 5. GitHub Pages

Cada push a `main` publica la web en https://joedev10.github.io/polcars-automotores/ (workflow en `.github/workflows/pages.yml`).
Se compila con `npm run build:pages`, que usa la base `/polcars-automotores/` y copia `index.html` a `404.html` para que funcionen los links directos.
