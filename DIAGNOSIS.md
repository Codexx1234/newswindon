# Diagnóstico del Proyecto NewSwindon

Tras analizar el repositorio, se han identificado los siguientes puntos críticos que coinciden con los problemas reportados por el usuario:

## 1. Sistema de Autenticación y Login
- **Problema:** El sistema actual depende principalmente de OAuth (`server/_core/oauth.ts`), lo cual puede fallar si no están configuradas las credenciales externas.
- **Inseguridad:** Existe una ruta de login por email/password en `routers.ts`, pero no hay una interfaz clara para que el Superadmin gestione estos usuarios (crear, asignar contraseñas).
- **Falta de Control:** No hay una distinción clara en la UI para que solo el Superadmin cree usuarios.

## 2. Plantillas de Correo
- **Estado Actual:** Existen archivos HTML en `server/emails/`, pero son muy básicos y no tienen un diseño profesional/lindo como solicita el usuario.
- **Falta de Robustez:** El sistema de carga de plantillas en `server/_core/email.ts` tiene fallbacks muy simples (texto plano en HTML básico).

## 3. Modo de Edición de Texto (CMS)
- **Problema de Conectividad:** El componente `ContentManagement.tsx` depende totalmente de la base de datos a través de tRPC. Si la base de datos falla, el contenido no se carga o se muestra el valor por defecto hardcodeado en el frontend.
- **Falta de Respaldo:** No existe un mecanismo de "copia de seguridad" local o en caché para el texto editado en caso de error de conexión.
- **Experiencia de Usuario:** La edición se hace a través de una tabla en el panel de admin, no es un modo de "edición sobre la página" (inline editing) que parece ser lo que el usuario prefiere.

## 4. Errores de Estructura/Código
- **Duplicación:** Hay archivos `.new` y `.ts` duplicados en la raíz del servidor (`db.ts` vs `db.ts.new`), lo que indica intentos previos de corrección no finalizados.
- **Dependencias:** El uso de `execSync` para llamar a scripts de Python para el hashing de contraseñas es ineficiente y propenso a errores de entorno. Sería mejor usar una librería nativa de Node.js como `bcryptjs`.

## Plan de Acción Inmediato
1. Migrar el hashing de contraseñas a una solución nativa de Node.js.
2. Crear una interfaz de gestión de usuarios exclusiva para Superadmin.
3. Rediseñar las plantillas de correo con un estilo profesional y moderno.
4. Implementar un sistema de caché/localStorage para el contenido editado como respaldo.
5. Refactorizar el modo de edición para que sea más intuitivo.
