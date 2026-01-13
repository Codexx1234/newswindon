import { trpc } from '@/lib/trpc';
import { useEffect, useState } from 'react';

/**
 * Hook para obtener contenido dinámico con sistema de respaldo (localStorage).
 * @param key Clave del bloque de contenido.
 * @param defaultValue Valor por defecto si no hay nada en DB ni en caché.
 * @returns El contenido a mostrar.
 */
export function useContent(key: string, defaultValue: string) {
  const [content, setContent] = useState<string>(() => {
    // Intentar cargar desde localStorage al inicializar
    if (typeof window !== 'undefined') {
      return localStorage.getItem(`content_backup_${key}`) || defaultValue;
    }
    return defaultValue;
  });

  const { data, isSuccess, isError } = trpc.content.getByKey.useQuery({ key }, {
    // No reintentar infinitamente si falla la conexión
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  useEffect(() => {
    if (isSuccess && data) {
      setContent(data);
      // Guardar en localStorage como copia de seguridad
      localStorage.setItem(`content_backup_${key}`, data);
    }
  }, [isSuccess, data, key]);

  // Si hay un error de conexión, el estado 'content' mantendrá el último valor exitoso 
  // o el valor inicial cargado desde localStorage.

  return content;
}
