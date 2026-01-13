# NewSwindon Language Institute - Web Platform

Este es el repositorio oficial de la plataforma web de **NewSwindon**, un instituto de inglés con más de 35 años de trayectoria. La aplicación está construida con un stack moderno enfocado en la velocidad, seguridad y facilidad de mantenimiento.

## 🤖 AI-Friendly Architecture

Este proyecto ha sido optimizado para ser procesado por herramientas de IA (como Cursor, GitHub Copilot o agentes autónomos). Sigue patrones de diseño consistentes y utiliza un tipado estricto para facilitar la comprensión del flujo de datos.

### Estructura del Proyecto

-   `client/`: Frontend desarrollado con **React**, **Vite** y **Tailwind CSS**.
    -   `src/components/`: Componentes modulares de UI (Shadcn/UI).
    -   `src/hooks/`: Lógica de estado reutilizable (incluye sistema de respaldo de contenido).
    -   `src/pages/`: Vistas principales de la aplicación.
-   `server/`: Backend robusto con **Node.js** y **Express**.
    -   `_core/`: Núcleo del sistema (Autenticación, Email, Configuración).
    -   `routers.ts`: Definición de la API mediante **tRPC** (Type-safe API).
    -   `db.ts`: Capa de acceso a datos (Repository Pattern) usando **Drizzle ORM**.
-   `shared/`: Código compartido entre cliente y servidor (Esquemas de validación Zod, constantes).
-   `drizzle/`: Definiciones de esquemas de base de datos y migraciones.

## 🛠 Stack Tecnológico

-   **Frontend:** React 19, TypeScript, Tailwind CSS, Framer Motion.
-   **Backend:** Node.js, Express, tRPC.
-   **Base de Datos:** MySQL / TiDB con Drizzle ORM.
-   **Seguridad:** Autenticación basada en JWT y Bcryptjs.
-   **Infraestructura:** GitHub Actions para CI/CD.

## 🚀 Características Principales

1.  **CMS Dinámico con Respaldo:** Edición de textos en tiempo real con copia de seguridad automática en `localStorage`.
2.  **Galería Drag & Drop:** Gestión intuitiva de imágenes con subida directa al servidor.
3.  **Sistema de Email Profesional:** Plantillas HTML personalizadas para confirmaciones y notificaciones.
4.  **Panel de Administración Seguro:** Gestión de usuarios con roles (`admin`, `super_admin`).
5.  **Chatbot Inteligente:** Asistente virtual integrado para responder consultas frecuentes.

## 📖 Guía para Desarrolladores / IAs

-   **API:** Todas las llamadas al servidor deben realizarse a través de `trpc` definido en `client/src/lib/trpc.ts`.
-   **Estilos:** Se utiliza Tailwind CSS. Los componentes base están en `client/src/components/ui/`.
-   **Base de Datos:** Para modificar la estructura, editar `drizzle/schema.ts` y ejecutar las migraciones correspondientes.
-   **Variables de Entorno:** Consultar `server/_core/env.ts` para ver las variables requeridas.

---
*Optimizado para el futuro por Manus AI.*
