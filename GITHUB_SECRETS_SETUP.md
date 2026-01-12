# Configuración de GitHub Secrets para NewSwindon

## ¿Qué son los GitHub Secrets?
Los **GitHub Secrets** son variables privadas y encriptadas que almacenas en tu repositorio de GitHub. Se utilizan para guardar información sensible (como contraseñas, tokens, claves API) sin exponerlas en el código fuente.

## Cómo acceder a la configuración de Secrets

1.  Ve a tu repositorio: [https://github.com/Codexx1234/newswindon](https://github.com/Codexx1234/newswindon)
2.  Haz clic en **Settings** (en la barra superior).
3.  En el menú lateral izquierdo, busca **Secrets and variables** y selecciona **Actions**.
4.  Haz clic en **New repository secret** para crear cada uno.

## Secrets Recomendados para NewSwindon

### 1. Secrets Obligatorios (Necesarios para que el Workflow funcione)

#### `VITE_APP_ID`
*   **Valor**: `newswindon-app`
*   **Descripción**: Identificador único de la aplicación.

#### `JWT_SECRET`
*   **Valor**: Una frase larga y aleatoria (ej: `super-secret-key-newswindon-2024-xyz123`)
*   **Descripción**: Clave para asegurar las sesiones de usuario.

#### `OAUTH_SERVER_URL`
*   **Valor**: `http://localhost:3000` (para pruebas) o tu URL de OAuth en producción.
*   **Descripción**: URL del servidor de autenticación.

#### `OWNER_OPEN_ID`
*   **Valor**: `test-owner-id` (puedes usar cualquier valor para pruebas)
*   **Descripción**: ID del propietario/administrador de la aplicación.

---

### 2. Secrets para el Sistema de Correos (Recomendado si usas Gmail)

#### `EMAIL_HOST`
*   **Valor**: `smtp.gmail.com`
*   **Descripción**: Servidor SMTP de Gmail.

#### `EMAIL_PORT`
*   **Valor**: `587`
*   **Descripción**: Puerto para conexión STARTTLS con Gmail.

#### `EMAIL_SECURE`
*   **Valor**: `false`
*   **Descripción**: Gmail usa STARTTLS en el puerto 587 (no es "secure" directo).

#### `EMAIL_USER`
*   **Valor**: `tu-correo@gmail.com`
*   **Descripción**: Tu dirección de Gmail.

#### `EMAIL_PASSWORD`
*   **Valor**: `Código de 16 letras de Google** (ver instrucciones abajo)
*   **Descripción**: Contraseña de aplicación generada por Google (NO tu contraseña normal).

#### `EMAIL_FROM`
*   **Valor**: `tu-correo@gmail.com`
*   **Descripción**: Dirección que aparecerá como remitente en los correos.

#### `ADMIN_EMAIL`
*   **Valor**: `tu-correo-personal@gmail.com`
*   **Descripción**: Tu correo personal donde recibirás las notificaciones de nuevos contactos.

---

### 3. Secrets Opcionales (Base de Datos)

#### `DATABASE_URL`
*   **Valor**: `mysql://root:password@localhost:3306/newswindon`
*   **Descripción**: Conexión a la base de datos MySQL (solo necesaria si quieres pruebas con BD real).

---

## Pasos para Generar la Contraseña de Aplicación de Gmail

**Importante**: Gmail no permite usar tu contraseña normal por seguridad. Debes generar una contraseña especial:

1.  Ve a [Google Account](https://myaccount.google.com/).
2.  Haz clic en **Security** (Seguridad) en el menú lateral.
3.  Busca **2-Step Verification** (Verificación en dos pasos) y asegúrate de que esté activada.
4.  Busca **App passwords** (Contraseñas de aplicaciones) en la misma sección.
5.  Selecciona **Mail** y **Windows Computer** (o tu dispositivo).
6.  Google te generará un código de **16 letras**. Cópialo sin espacios.
7.  Ese código es lo que debes poner en el Secret `EMAIL_PASSWORD`.

---

## Resumen de Secrets para Copiar y Pegar

Si usas Gmail y quieres que todo funcione rápidamente, crea estos 8 secrets:

| Nombre | Valor |
| :--- | :--- |
| `VITE_APP_ID` | `newswindon-app` |
| `JWT_SECRET` | `tu-frase-larga-y-segura` |
| `OAUTH_SERVER_URL` | `http://localhost:3000` |
| `OWNER_OPEN_ID` | `test-owner-id` |
| `EMAIL_HOST` | `smtp.gmail.com` |
| `EMAIL_PORT` | `587` |
| `EMAIL_USER` | `tu-correo@gmail.com` |
| `EMAIL_PASSWORD` | `código-de-16-letras-de-google` |
| `EMAIL_FROM` | `tu-correo@gmail.com` |
| `ADMIN_EMAIL` | `tu-correo-personal@gmail.com` |

---

## Cómo Verificar que Funciona

1.  Una vez que hayas configurado los secrets, ve a la pestaña **Actions** en tu repositorio.
2.  Deberías ver un workflow llamado **"E2E Tests & Build"** ejecutándose.
3.  Si todo está bien, terminará con un **✅ check verde**.
4.  Si falla, haz clic en el workflow para ver los errores y ajusta los secrets según sea necesario.

---

## Troubleshooting

### Error: "VITE_APP_ID is not defined"
→ Asegúrate de haber creado el secret `VITE_APP_ID` correctamente.

### Error: "Failed to send email"
→ Verifica que `EMAIL_PASSWORD` sea el código de 16 letras de Google (no tu contraseña normal).

### Error: "Connection refused" en DATABASE_URL
→ Es normal en GitHub Actions. El workflow está diseñado para funcionar sin una BD real en las pruebas.

---

¡Listo! Con esto configurado, tu workflow de GitHub Actions debería ejecutarse sin problemas cada vez que hagas un push a la rama `main`.
