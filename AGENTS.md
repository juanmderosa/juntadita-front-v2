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
pnpm format
pnpm format:check
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
- Revisar tambien las capturas de `design/` relacionadas antes de implementar
  una pantalla o flujo visual.
- Usar arquitectura feature-based.
- Paginas componen la pantalla; no concentran estado, requests ni reglas.
- Componentes renderizan y reciben callbacks/datos; la logica de estado,
  queries, mutations, transformaciones y reglas vive en hooks o `lib`.
- Dividir componentes grandes en piezas pequenas por responsabilidad; no mezclar
  formularios, listados, paneles y logica de datos en un mismo componente.
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
- No avanzar de una subtarea a la siguiente sin aprobacion explicita de Juan.

## flujo de trabajo

1. Para tareas grandes, revisar plan y decisiones globales y proponer etapas
   chicas, con alcance y criterio de aceptacion por etapa.
2. Esperar aprobacion explicita de Juan al plan antes de implementar.
3. Revisar README, `DESIGN.md`, capturas relacionadas y docs API antes de
   tocar el frontend.
4. Implementar solo la etapa actual, respetando la separacion pagina -> hooks
   -> componentes pequenos -> `lib`/API. Si una decision de producto o diseno
   es ambigua, detenerse y pedir definicion.
5. Ejecutar las pruebas, build y lint aplicables; revisar visualmente los
   cambios cuando afecten UI.
6. Cerrar cada etapa con resumen, archivos modificados, pruebas, riesgos y
   propuesta de commit, dejandola `En revision`.
7. Esperar aprobacion explicita de Juan antes de iniciar la siguiente etapa o
   marcar una tarea como `Hecha`.

## Documentación

- [`README.md`](README.md)
- [`DESIGN.md`](DESIGN.md)
- [`design/`](design/)
- [`../juntadita-backend/docs/api`](../juntadita-backend/docs/api)
- [`../juntadita-project/docs/mvp-plan.md`](../juntadita-project/docs/mvp-plan.md)
- [`../juntadita-project/docs/decisions.md`](../juntadita-project/docs/decisions.md)
