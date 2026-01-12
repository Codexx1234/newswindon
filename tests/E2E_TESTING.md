# Pruebas E2E con Playwright - NewSwindon

Este documento describe cómo ejecutar y mantener las pruebas End-to-End (E2E) del proyecto NewSwindon usando Playwright.

## Instalación

Las dependencias de Playwright ya están instaladas. Si necesitas reinstalarlas:

```bash
pnpm add -D @playwright/test
```

## Ejecución de Pruebas

### Ejecutar todas las pruebas
```bash
pnpm test:e2e
```

### Ejecutar pruebas en modo UI (recomendado para desarrollo)
```bash
pnpm test:e2e:ui
```

### Ejecutar pruebas en modo debug
```bash
pnpm test:e2e:debug
```

### Ejecutar pruebas específicas
```bash
pnpm test:e2e -- tests/e2e/home.spec.ts
```

### Ejecutar pruebas con un navegador específico
```bash
pnpm test:e2e -- --project=chromium
pnpm test:e2e -- --project=firefox
pnpm test:e2e -- --project=webkit
```

## Estructura de Pruebas

Las pruebas se encuentran en `tests/e2e/` y están organizadas por funcionalidad:

- **home.spec.ts**: Pruebas de la página de inicio, navegación, SEO y rendimiento

## Cobertura de Pruebas

### Página de Inicio
- ✅ Carga correcta de la página
- ✅ Visibilidad de botones CTA (Call-to-Action)
- ✅ Animación de contadores de estadísticas
- ✅ Navegación a secciones
- ✅ Formulario de contacto
- ✅ Sección de testimonios
- ✅ Barra de navegación

### SEO
- ✅ Metaetiquetas correctas
- ✅ Datos estructurados (JSON-LD)
- ✅ Sitemap.xml
- ✅ Robots.txt
- ✅ URL canónica

### Responsividad
- ✅ Viewport móvil (375x667)
- ✅ Viewport tablet (768x1024)
- ✅ Viewport desktop

### Rendimiento
- ✅ Tiempo de carga aceptable
- ✅ Sin errores en consola

### Página de Empresas
- ✅ Carga correcta
- ✅ Formulario específico para empresas

### Navegación
- ✅ Navegación entre páginas
- ✅ Scroll suave a secciones

## Configuración

El archivo `playwright.config.ts` contiene la configuración de Playwright:

- **Navegadores**: Chromium, Firefox, WebKit
- **Dispositivos móviles**: Pixel 5, iPhone 12
- **Base URL**: http://localhost:5173
- **Servidor de desarrollo**: Se inicia automáticamente

## Reportes

Después de ejecutar las pruebas, se genera un reporte HTML:

```bash
pnpm test:e2e
# Luego abre el reporte con:
pnpm exec playwright show-report
```

## Mejores Prácticas

1. **Selectores específicos**: Usa `id` o `data-testid` cuando sea posible
2. **Esperas explícitas**: Usa `waitForLoadState()` para esperar a que la página esté lista
3. **Pruebas independientes**: Cada prueba debe ser independiente
4. **Nombres descriptivos**: Los nombres de las pruebas deben describir qué se prueba
5. **Assertions claras**: Usa assertions específicas y claras

## Agregar Nuevas Pruebas

Para agregar nuevas pruebas:

1. Abre `tests/e2e/home.spec.ts` o crea un nuevo archivo
2. Usa el patrón de `test.describe()` para agrupar pruebas relacionadas
3. Escribe pruebas usando `test()` con descripciones claras
4. Usa selectores específicos y esperas explícitas

Ejemplo:
```typescript
test('should do something specific', async ({ page }) => {
  await page.goto('/');
  
  const element = page.locator('text=Something');
  await expect(element).toBeVisible();
});
```

## Solución de Problemas

### Las pruebas se cuelgan
- Verifica que el servidor de desarrollo esté corriendo
- Aumenta el timeout en `playwright.config.ts`

### Selectores no funcionan
- Usa `page.pause()` para pausar la ejecución
- Inspecciona el elemento en el navegador
- Usa `page.locator()` con selectores más específicos

### Errores de timeout
- Aumenta el timeout global en `playwright.config.ts`
- Usa `page.waitForLoadState('networkidle')` para esperar a que la red esté inactiva

## Integración Continua

Para ejecutar pruebas en CI/CD:

```bash
# En tu pipeline de CI
pnpm test:e2e
```

Las pruebas se ejecutarán automáticamente en Chromium con reintentos habilitados.

## Recursos

- [Documentación de Playwright](https://playwright.dev)
- [Guía de Selectores](https://playwright.dev/docs/locators)
- [API de Assertions](https://playwright.dev/docs/test-assertions)
