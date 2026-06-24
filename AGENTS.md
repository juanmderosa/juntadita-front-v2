# AGENTS.md

Guia breve para agentes en `juntadita-frontend`. Mantener este archivo liviano:
las reglas largas viven en la documentacion enlazada.

## Nombre del proyecto

Juntadita Frontend.

## Stack

React 19 + Vite + TypeScript + Tailwind CSS + React Router + TanStack Query +
React Hook Form + Zod + Supabase Auth + pnpm.

## Comandos

```text
pnpm dev
pnpm build
pnpm lint
pnpm preview
```

## Estructura del proyecto

```text
src/api          clientes HTTP por dominio
src/lib          helpers puros y configuracion
src/routes       router y rutas protegidas
src/features     pages, hooks, components y schemas por feature
src/components   UI reutilizable sin logica de negocio
src/hooks        hooks transversales
src/schemas      schemas compartidos
src/types        tipos compartidos
design           capturas de referencia
```

## Convenciones

- Revisar `DESIGN.md` antes de tocar UI, layout o estilos.
- Usar arquitectura feature-based.
- Componentes renderizan; logica en hooks personalizados.
- Usar React Hook Form + Zod para formularios.
- Usar `schemas`, nunca `schema`; usar `lib`, nunca `utils`.
- Supabase en frontend solo para Auth; datos de negocio via API Express.
- Si cambia consumo de API, verificar contrato en `../juntadita-backend/docs/api`.

## No hagas

- No poner reglas de negocio en componentes React.
- No acceder directo a tablas de negocio de Supabase.
- No duplicar mutation hooks para compartir estado o errores.
- No contradecir `DESIGN.md` sin decision explicita de Juan.
- No crear paquete compartido con backend durante el MVP.
- No guardar secretos reales en el repo.
- No marcar tareas como `Hecha` sin aceptacion explicita de Juan.

## flujo de trabajo

1. Para tareas grandes, revisar plan y decisiones globales.
2. Revisar README, DESIGN y capturas si hay cambios visuales.
3. Revisar docs API si se consumen endpoints.
4. Revisar si hay skills disponibles que ayuden a cumplir la tarea.
5. Implementar con UI en componentes y logica en hooks.
6. Ejecutar `pnpm build` y `pnpm lint` cuando aplique.
7. Cerrar con resumen, pruebas, riesgos y propuesta de commit.

## Documentación

- [`README.md`](README.md)
- [`DESIGN.md`](DESIGN.md)
- [`design/`](design/)
- [`../juntadita-backend/docs/api`](../juntadita-backend/docs/api)
- [`../juntadita-project/docs/mvp-plan.md`](../juntadita-project/docs/mvp-plan.md)
- [`../juntadita-project/docs/decisions.md`](../juntadita-project/docs/decisions.md)
