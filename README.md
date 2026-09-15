# PQR Sersocial — Frontend

React + Vite + TypeScript con **Screaming Architecture** (`auth`, `pqr`, `estadisticas`, `shared`, `app`).

## Setup

```bash
pnpm install
copy .env.example .env
pnpm dev
```

App: http://127.0.0.1:5173  
API por defecto: `VITE_API_URL=http://127.0.0.1:8000`

## Pantallas

- `/` listado + filtros + búsqueda por radicado
- `/pqr/nueva` registro
- `/pqr/:id` detalle, estado/prioridad y seguimiento
- `/estadisticas` gráficos (requiere login de agente)
- Login de agentes: modal global (no hay ruta `/login`)

Credenciales de desarrollo: `agente@sersocial.test` / `Agente123!` (solo README, no van precargadas en la UI).
