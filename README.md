# OPSNIGHT Prototype

Prototipo navegable de OPSNIGHT, un cockpit operativo para discotecas, grandes salas y restauracion de alto volumen.

## Build local

```bash
npm run build
```

Esto genera una build estatica en:

```text
public/
dist/
```

Para previsualizar localmente puedes servir la carpeta `public/` con cualquier servidor estatico.

Ejemplo:

```bash
python3 -m http.server 8080 --directory public
```

Luego abre:

```text
http://127.0.0.1:8080
```

## Deploy en Vercel

Este proyecto NO tiene backend en produccion y NO debe ejecutar `server.js`, `dev-server.js`, `npm start` ni funciones serverless.

Vercel debe servir solo la build estatica:

- Build Command: `npm run build`
- Output Directory: `public`

La configuracion vive en `vercel.json` y fuerza fallback SPA a `index.html`.

Si Vercel muestra `This Serverless Function has crashed`, esta usando una configuracion antigua o un deployment viejo. Haz redeploy con `Clear build cache` activado y confirma que el commit contiene `vercel.json` y que ya no existe `server.js`.

## Incluye

- Master Control Dashboard con revenue, margen, aforo, staff, stock y audit stream.
- Locales con pantalla de detalle por local, permisos editables, aforo legal/real y cierre nocturno.
- Personal con perfiles ampliables en screen dedicada, costes, turnos, geofichaje, empresas externas, dispositivos y TPV por empleado.
- Finanzas, inventario, modo oscuro y ajustes funcionales.
