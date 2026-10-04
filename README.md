# Schützend · web

Vite + React + Tailwind v4 + framer-motion. SPA con navegación por hash (`#tienda`, `#canales`…).

## Desarrollo
```bash
bun install      # o npm install
bun run dev      # http://localhost:5173
bun run build    # genera dist/
```

## Editar enlaces
Todos los enlaces están en `src/links.ts`. Los que valen `null` (libros, comisiones, pequeños experimentos) se muestran sin enlace hasta que los rellenes.

## Deploy en Cloudflare Pages
1. Sube esta carpeta a un repo nuevo de GitHub.
2. Cloudflare → Workers & Pages → Create → Pages → Connect to Git → elige el repo.
3. Framework preset: **Vite** · Build command: `npm run build` · Output directory: `dist`.
4. Dominio propio: Pages → Custom domains → `schutzend.com`.

## Estructura
- `src/views.tsx`: las 7 secciones.
- `src/components/ui.tsx`: botones amarillos, barra de navegación, enlaces, iconos.
- `src/components/Bichos.tsx`: bichito con bocadillo y bicho azul que habla.
- `src/components/Ondas.tsx`: fondo animado de la tienda.
- `public/img/`: imágenes extraídas del Canva (WebP).
