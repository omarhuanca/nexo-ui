# Nexo UI

* [Información](#información)
* [Requisitos](#requisitos)
* [Tecnologías](#tecnologías)
* [Librerías principales](#librerías-principales)
* [Estructura del proyecto](#estructura-del-proyecto)
* [Variables de entorno](#variables-de-entorno)
* [Instalación](#instalación)
* [Ejecución](#ejecución)
* [Build](#build)
* [Despliegue](#despliegue)
* [Scripts disponibles](#scripts-disponibles)
* [Buenas prácticas](#buenas-prácticas)
* [Integración con API](#integración-con-api)
* [Documentación](#documentación)

---

## Información

**Nexo UI** es el frontend de la plataforma Nexo, desarrollado con **React, Vite y TypeScript**.

La aplicación consume servicios REST del backend para consultar información relacionada con:

- Facturas fiscalizadas.
- Integraciones con TaxCore y Xero.
- Organizaciones.
- Estados y detalles de operaciones del sistema.

La aplicación utiliza TanStack React Query para administrar las consultas remotas, los filtros de consulta se sincronizan con la URL para facilitar la navegación y conservar el contexto de búsqueda.

## Requisitos

- Node.js **22+** LTS compatible con Vite 8.
- npm. **11+**
- Git.
- Acceso al backend de Nexo.

Verificar las versiones instaladas:

```bash
node --version
npm --version
git --version
```

## Tecnologías

- React `19.2`
- React DOM `19.2`
- Vite `8.0`
- TypeScript `6.0`
- Tailwind CSS `4.3`
- React Router `7.18`
- Axios `1.18`
- TanStack React Query `5.101`
- React Hook Form `7.80`
- Zod `4.4`
- ESLint `9.39`

Las versiones declaradas pueden consultarse en [`package.json`](package.json).

## Librerías principales

### Interfaz y estilos

- `tailwindcss`
- `@tailwindcss/vite`
- `lucide-react`
- `class-variance-authority`
- `clsx`
- `tailwind-merge`

### Componentes UI

- Radix UI para accordion, checkbox, collapsible, dialog, dropdown menu, label, popover, select, tabs, tooltip y componentes relacionados.
- `cmdk`
- `vaul`

### Datos, formularios y validación

- `@tanstack/react-query`
- `@tanstack/react-table`
- `axios`
- `react-hook-form`
- `@hookform/resolvers`
- `zod`
- `nuqs`

### Fechas y notificaciones

- `date-fns`
- `react-day-picker`
- `sonner`

Para instalar todas las dependencias:

```bash
npm install
```

## Estructura del proyecto

```text
src/
├── app/
│   ├── App.tsx              # Componente raíz
│   ├── providers.tsx        # Providers globales
│   └── router.tsx           # Configuración de rutas
├── components/
│   ├── common/              # Componentes comunes
│   ├── feedback/            # Loading, error y empty states
│   ├── layout/              # Navbar, sidebar y shell principal
│   └── ui/                  # Componentes UI reutilizables
├── features/
│   ├── audit-logs/          # Registros de auditoría
│   ├── invoices/            # Facturas
│   └── organizations/       # Organizaciones
├── hooks/                   # Hooks globales
├── lib/
│   ├── api.ts               # Cliente Axios
│   ├── env.ts               # Variables de entorno
│   ├── query-client.ts      # Configuración de React Query
│   └── utils.ts             # Utilidades generales
├── types/
│   └── api.ts               # Tipos compartidos de API
├── index.css                # Estilos globales
├── main.tsx                 # Punto de entrada
└── vite-env.d.ts            # Tipos de Vite
```

Las funcionalidades de negocio se organizan por dominio dentro de `src/features`:

```text
src/features/audit-logs/
├── api/                     # Query keys y hooks de API
├── components/              # Componentes de la funcionalidad
├── hooks/                   # Hooks específicos
├── pages/                   # Páginas
└── types/                   # Tipos de dominio
```

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_API_BASE_URL=/api
```

`VITE_API_BASE_URL` define la URL base utilizada por Axios.

Durante el desarrollo local, las peticiones `/api` son redirigidas por el proxy configurado en [`vite.config.ts`](vite.config.ts):

```text
/api -> https://nexo.test
```

Para utilizar directamente un backend remoto, puedes configurar:

```env
VITE_API_BASE_URL=https://backendnexo.shop/api
```

No incluyas en el repositorio:

- Tokens.
- Contraseñas.
- Claves privadas.
- Credenciales de servicios.
- Archivos `.env` con información sensible.

## Instalación

Clona el repositorio y accede al proyecto:

```bash
git clone <repository-url>
cd nexo-ui
```

Instala las dependencias:

```bash
npm install
```

Configura las variables de entorno antes de iniciar la aplicación.

## Ejecución

Ejecuta el proyecto en modo desarrollo:

```bash
npm run dev
```

La aplicación estará disponible normalmente en:

```text
http://localhost:5173
```

El servidor de desarrollo utiliza Hot Module Replacement para reflejar los cambios automáticamente.

## Rutas principales

| Ruta | Descripción |
| --- | --- |
| `/` | Redirección hacia `/invoices` |
| `/invoices` | Consulta y detalle de facturas |
| `/audit-logs` | Consulta de registros de auditoría |

Las páginas se cargan de forma lazy mediante React Router.

## Integración con API

El cliente HTTP centralizado se encuentra en [`src/lib/api.ts`](src/lib/api.ts).

La aplicación utiliza Axios con:

- Base URL configurable.
- Header `Content-Type: application/json`.
- Header `Accept: application/json`.
- Timeout de 30 segundos.

Las consultas remotas se gestionan mediante TanStack React Query. Cada feature define sus propias query keys y hooks de API.

## Build

Genera el build de producción:

```bash
npm run build
```

Este comando ejecuta la verificación de tipos con TypeScript y compila la aplicación con Vite.

Los archivos generados se encuentran en:

```text
dist/
```

Para probar el build localmente:

```bash
npm run preview
```

## Despliegue

El proyecto está preparado para desplegarse como una aplicación Vite estática en servicios como:

- Vercel.
- Netlify.
- Nginx.
- Apache.
- Docker.
- Servidores on-premise.

La configuración adicional de Vercel se encuentra en [`vercel.json`](vercel.json).

Antes del despliegue, configura:

```env
VITE_API_BASE_URL=<api-base-url>
```

Ejemplo de build para producción:

```bash
npm install
npm run build
```

El directorio que debe publicarse es:

```text
dist/
```

## Scripts disponibles

| Script | Descripción |
| --- | --- |
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Ejecuta typecheck y genera el build |
| `npm run typecheck` | Verifica los tipos de TypeScript |
| `npm run lint` | Ejecuta ESLint |
| `npm run preview` | Sirve localmente el build de producción |

## Buenas prácticas

- Usar TypeScript con configuración estricta.
- Mantener las funcionalidades organizadas por dominio dentro de `features`.
- Reutilizar los componentes UI existentes.
- Mantener las llamadas HTTP dentro de hooks de API.
- Utilizar query keys específicas para React Query.
- Usar `URLSearchParams` para construir parámetros de consulta.
- Reutilizar `PaginatedResponse<T>` para respuestas paginadas.
- Sincronizar filtros importantes con la URL.
- Evitar ejecutar consultas con parámetros obligatorios vacíos.
- Usar `keepPreviousData` para evitar parpadeos durante la paginación.
- Mantener separados los estados de loading, error y empty.
- No exponer credenciales en el frontend ni en el repositorio.
- Ejecutar typecheck, lint y build antes de integrar cambios.

## Documentación

La documentación del proyecto debe cubrir:

- Arquitectura general del proyecto.
- Organización por features.
- Configuración de variables de entorno.
- Consumo de APIs.
- Manejo de filtros y paginación.
- Estados de carga, error y resultados vacíos.
- Integración con TaxCore y Xero.
- Consulta de registros de auditoría.
- Proceso de build y despliegue.

