# Juntadita Frontend

Frontend React + Vite para el MVP de Juntadita.

## Stack

- React.
- Vite.
- TypeScript.
- Tailwind CSS.
- TanStack Query.
- React Router.
- React Hook Form.
- Zod.

## Arquitectura

La app usa estructura feature-based. Los componentes renderizan UI; la logica
vive en hooks personalizados.

```text
src/
  api/
  lib/
  routes/
  features/
  components/
  hooks/
  schemas/
  types/
```

## Scripts

```text
pnpm install
pnpm dev
pnpm build
```

## Commit propuesto

```text
chore(frontend): crear estructura inicial de React con Vite
```

Descripcion:

- Agrega base del frontend React.
- Define estructura feature-based.
- Prepara cliente HTTP, rutas, librerias compartidas y carpetas principales.
