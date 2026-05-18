# OPSNIGHT Prototype

Prototipo navegable de OPSNIGHT, un cockpit operativo para discotecas, grandes salas y restauracion de alto volumen.

## Desarrollo local

```bash
npm run dev
```

Esto levanta un servidor local en:

```text
http://127.0.0.1:3000
```

Sirve directamente los archivos del prototipo y aplica fallback SPA a `index.html`.

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

Este proyecto NO tiene backend en produccion y NO debe ejecutar `server.js`, `dev-server.js`, `app.js`, `npm start` ni funciones serverless.

Vercel debe servir solo la build estatica:

- Build Command: `npm run build`
- Output Directory: `public`

La configuracion vive en `vercel.json`, fuerza el preset `Other` con `"framework": null` y aplica fallback SPA a `index.html`.

Si Vercel muestra `This Serverless Function has crashed`, esta usando una configuracion antigua o un deployment viejo. Haz redeploy con `Clear build cache` activado y confirma que el commit contiene `vercel.json`, que ya no existe `server.js` y que el JavaScript de navegador no se llama `app.js` en la raiz.

## Incluye

- Master Control Dashboard con revenue, margen, aforo, staff, stock y audit stream.
- Locales con pantalla de detalle por local, permisos editables, aforo legal/real y cierre nocturno.
- Personal con perfiles ampliables en screen dedicada, costes, turnos, geofichaje, empresas externas, dispositivos y TPV por empleado.
- Finanzas, inventario, modo oscuro y ajustes funcionales.

## Conexion con Supabase

La app ya puede inicializar un cliente de Supabase directamente en navegador para empezar a sacar datos reales de un local.

1. Abre [supabase/config.js](/Users/PabloGrau/Desktop/vipsupermanager/supabase/config.js) y rellena:
   - `url`
   - `publishableKey`
   - `venueSlug`
2. Ejecuta el SQL base de [supabase/schema.sql](/Users/PabloGrau/Desktop/vipsupermanager/supabase/schema.sql) en el editor SQL de tu proyecto.
3. Ejecuta después [supabase/seed.sql](/Users/PabloGrau/Desktop/vipsupermanager/supabase/seed.sql) para cargar el primer local operativo con productos, mesas VIP, aforo y snapshots de finanzas.
4. Usa siempre una `publishable key` o `anon key` de cliente. No metas nunca la `service_role` en esta app estática.

Nota: el esquema deja lectura publica temporal para `venues`, `products`, `vip_tables`, `capacity_counters` y `finance_daily_snapshots` porque la app todavia no tiene login operativo. Las escrituras siguen pensadas para acceso autenticado por local.

Si quieres usar el prototipo sin login y grabar desde la UI:

- vuelve a ejecutar [supabase/schema.sql](/Users/PabloGrau/Desktop/vipsupermanager/supabase/schema.sql) cuando cambie
- esas ultimas revisiones anaden politicas temporales de escritura publica para `pos_sales`, `pos_sale_items`, `vip_tables`, `vip_reservations` y `capacity_counters`
- esto es solo para MVP / demo de un local y debe retirarse en cuanto exista autenticacion real

La capa de conexión vive en [supabase/bridge.js](/Users/PabloGrau/Desktop/vipsupermanager/supabase/bridge.js) y expone `window.mphSupabase` con utilidades para:

- cargar el local activo
- leer snapshots de finanzas
- listar productos, mesas VIP y contadores de aforo
- hacer `upsert` de filas
