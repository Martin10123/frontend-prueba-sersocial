# PQR Sersocial — Frontend

SPA React + Vite + TypeScript para el sistema de PQR. Consume el API Django.

Backend: [prueba-backend-sersocial](https://github.com/Martin10123/prueba-backend-sersocial).

## Enlaces de entrega

La URL de Jira es la misma que en el backend. Guía para crear el tablero: en el repo backend, `docs/jira.md`.

| Recurso | URL |
|---------|-----|
| Frontend | https://github.com/Martin10123/frontend-prueba-sersocial |
| Backend | https://github.com/Martin10123/prueba-backend-sersocial |
| Tablero Kanban (Jira) | https://martinsworkspace-45833364.atlassian.net/jira/software/projects/KAN/boards/1 |
| Historias / DER / flujo / arquitectura | En el repo backend, carpeta `docs/` |
| Guía de despliegue | [backend docs/despliegue.md](https://github.com/Martin10123/prueba-backend-sersocial/blob/main/docs/despliegue.md) |

## Uso de IA

Se utilizó **Cursor** para armar la SPA (rutas, pantallas PQR, login, cliente HTTP y este README). El candidato revisó flujos reales contra el API (alta, filtros, radicado, roles y estadísticas).

## Requisitos

- Node.js **20+**
- pnpm (o npm)
- API en http://127.0.0.1:8000 (ver README del backend)

## Instalación (~5 min, con el backend ya arriba)

```bash
pnpm install
cp .env.example .env
pnpm dev
```

Windows: `copy .env.example .env`.

`.env`:

```env
VITE_API_URL=http://127.0.0.1:8000
```

App: http://127.0.0.1:5173

Levantar el API primero (`docker compose up --build` en el repo backend). CORS ya incluye `http://localhost:5173` y `http://127.0.0.1:5173`.

## Pantallas (MVP)

| Ruta | Pantalla |
|------|----------|
| `/` | Listado + filtros + búsqueda por radicado |
| `/pqr/nueva` | Registro con validación (Zod) |
| `/pqr/:id` | Detalle, cambio de estado/prioridad, seguimiento |
| `/estadisticas` | Conteos por estado y tipo (login de agente) |

Login de agentes: modal global (no hay ruta `/login`).

## Credenciales demo

Las crea el seed del backend:

| Email | Password | Rol |
|-------|----------|-----|
| agente@sersocial.test | Agente123! | agente |
| supervisor@sersocial.test | Super123! | supervisor |
| admin@sersocial.test | Admin123! | admin |

El agente no puede cerrar una PQR; supervisor y admin sí.

## Scripts

```bash
pnpm dev
pnpm build
pnpm preview
pnpm lint
```

Producción: `VITE_API_URL` debe ser la URL pública del API (sin barra final). Pasos en la guía de despliegue del backend.
