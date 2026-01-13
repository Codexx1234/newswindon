import bcrypt from 'bcryptjs';

/**
 * Hashea una contraseña usando bcryptjs.
 * @param password Contraseña en texto plano.
 * @returns Contraseña hasheada.
 */
export function hashPassword(password: string): string {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

/**
 * Verifica si una contraseña coincide con su hash.
 * @param password Contraseña en texto plano.
 * @param hashed Hash almacenado en la base de datos.
 * @returns True si coinciden, false en caso contrario.
 */
export function verifyPassword(password: string, hashed: string): boolean {
  try {
    return bcrypt.compareSync(password, hashed);
  } catch (error) {
    console.error("[PasswordUtils] Error verificando contraseña:", error);
    return false;
  }
}
