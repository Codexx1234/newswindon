# NewSwindon - Lista de Tareas 🚀

## ✅ Mejoras Implementadas
- [x] **UI/UX:** Cambio a tipografía Inter, ajuste de espaciado y colores suaves.
- [x] **Navbar:** Corregida superposición, eliminado "Portal Estudiantes" y arreglada navegación por anclas.
- [x] **Sección Empresas:** Landing completa (/empresas), formulario específico y diseño corporativo.
- [x] **Diseño Global:** Centrado de todos los elementos (Sobre Nosotros, Cursos, Beneficios).
- [x] **Contacto:** Reorganización (Datos a la izquierda, Formulario a la derecha) y eliminación de horarios.
- [x] **Chatbot:** Ventana emergente mejorada con botón de cierre accesible.
- [x] **Admin:** Gestión completa de FAQs y Testimonios.
- [x] **SEO:** Optimización de meta tags y datos estructurados.

## 🚀 Próximas Mejoras Avanzadas (Plan de Acción)

### 🛠 Backend e Infraestructura
- [x] **Sistema de Reservas:** Implementar lógica para agendar entrevistas de nivelación (Tabla `appointments`).
- [x] **Métricas de Admin:** Sistema de tracking diario para visitas, contactos y reservas (Tabla `daily_metrics`).
- [x] **Validación de Datos:** Mejorar la validación de teléfonos para permitir contacto directo vía WhatsApp desde el panel.

### 🎨 Frontend y UX (Experiencia de Usuario)
- [x] **Micro-interacciones:** Integrar *Framer Motion* para animaciones fluidas en botones, tarjetas y transiciones de página.
- [ ] **Optimización de Imágenes:** Migrar assets a formato WebP y aplicar carga perezosa (lazy loading) para mejorar la velocidad.
- [x] **Botón de WhatsApp en Éxito:** Añadir acceso directo a WhatsApp tras el envío de formularios.

### 📊 Panel de Control (Admin)
- [x] **Dashboard Visual:** Añadir métricas de rendimiento semanal basadas en las nuevas métricas.
- [x] **Gestión de Reservas:** Crear una interfaz para que el administrador vea y gestione las citas agendadas.

### 📈 Marketing y SEO
- [x] **SEO Local:** Optimizar metatags para palabras clave locales (Carapachay, Zona Norte, Cursos de Inglés).
- [x] **Automatización de Email:** Lógica para envío automático de correos de bienvenida (Simulada/Backend).

---
*Nota: Este plan fue diseñado para escalar la presencia digital de NewSwindon y automatizar procesos administrativos.*

## Correcciones Urgentes
- [x] Corregir lógica de validación de horarios ocupados (muestra ocupado cuando no lo está)
- [x] Implementar eliminación de reservas al cancelar
- [x] Configurar envío de emails SMTP (error actual)
- [x] Integrar Google Calendar para crear eventos
- [x] Sincronizar eliminación de eventos en Google Calendar al cancelar reserva
- [x] Agregar funcionalidad de edición de contactos en admin

## Tareas Actuales (Sesión)
- [x] Corregir error de PageTransition con key prop
- [x] Validar configuración de emails SMTP desde GitHub
- [x] Sincronizar cambios desde GitHub
- [x] Probar envío de emails
- [x] Corregir errores de TypeScript en Admin.tsx, Navbar.tsx y GallerySection.tsx
- [x] Agregar procedimiento getAuditLogs al router de metrics
- [x] Corregir errores de settings.get retornando undefined
- [x] Implementar valores por defecto para settings
- [x] Mejorar setSetting con mejor manejo de errores
- [x] Agregar importación de nodemailer en email.ts

## Integración de Cambios de GitHub (Nueva Sesión)
- [x] Revisar panel de edición nuevo en Admin.tsx
- [x] Verificar templates nuevos de correos
- [x] Corregir errores de TypeScript
- [x] Probar funcionalidad completa
- [x] Validar que no haya errores en runtime
- [x] Agregar campo password a tabla users
- [x] Agregar rol super_admin
- [x] Integrar funciones de usuario (getUserByEmail, getAllUsers, deleteUser)
- [x] Integrar funciones de content blocks
- [x] Agregar procedimiento login con email/password
- [x] Copiar templates de email mejorados
- [x] Copiar passwordUtils.ts y hash_utils.py


## Bugs Reportados
- [x] Super admin no puede acceder al panel de admin (verificar validación de roles)


## Nuevas Funcionalidades (Nueva Sesión)
- [x] Crear tabla contentBlocks en schema
- [x] Agregar funciones de content blocks en db.ts
- [x] Agregar procedimientos de content blocks a routers.ts
- [x] Crear componente ContentManagement en Admin
- [x] Inicializar content blocks con valores por defecto
- [x] Integrar content blocks en Home.tsx para mostrar valores dinámicos
- [x] Probar flujo completo de edición
