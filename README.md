# OPSNIGHT Prototype

Prototipo navegable de OPSNIGHT, un cockpit operativo para discotecas, grandes salas y restauracion de alto volumen.

## Ejecutar

```bash
npm run dev
```

Luego abre:

```text
http://localhost:8080
```

## Deploy en Vercel

Vercel debe publicar la build estatica generada en `dist/`.

```bash
npm run build
```

La configuracion vive en `vercel.json`:

- Build command: `npm run build`
- Output directory: `dist`
- Fallback SPA: cualquier ruta vuelve a `index.html`

## Incluye

- Master Control Dashboard con revenue, margen, aforo, staff, stock y audit stream.
- TPV conversacional de barra con ticket vivo, modifiers y pagos simulados.
- Floor plan VIP con seleccion de mesas, minimo pendiente e inspector.
- BDS para runners con estados de preparacion.
- Stock & P&L con OCR simulado y alertas de coste.
- Resiliencia visual de `Local mode` mediante simulacion de rush.
