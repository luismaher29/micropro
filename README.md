# MicroMaster Academy Local

Version independiente de una app gamificada para aprender micropigmentacion.

## Caracteristicas

- Vite + React + TypeScript
- Sin Gemini API
- Sin `GEMINI_API_KEY`
- Sin backend
- Contenido 100% local en archivos TS
- 5 mundos con 5 niveles cada uno
- Sistema de XP, monedas, racha, estrellas y recompensas desbloqueables
- Lista para desplegar en Vercel

## Scripts

- `npm install`
- `npm run dev`
- `npm run build`
- `npm run preview`

## Despliegue en Vercel

1. Sube esta carpeta a GitHub o importala directamente en Vercel.
2. En la configuracion del proyecto usa:
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. No agregues variables de entorno para APIs porque la app no las necesita.

## Estructura

```text
src/
  components/
  data/
  game/
  pages/
  styles/
```

## Datos locales

Los mundos, niveles, preguntas, respuestas, feedback y recompensas viven en:

- `src/data/worlds.ts`
- `src/data/rewards.ts`

La logica de progreso y persistencia local vive en:

- `src/game/useGameStore.ts`
