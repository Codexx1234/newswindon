import rateLimit from 'express-rate-limit';

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 login attempts per window
  message: {
    error: 'Demasiados intentos de inicio de sesión. Por favor, intente de nuevo en 15 minutos.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const contactRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 contact submissions per hour
  message: {
    error: 'Has enviado demasiados mensajes. Por favor, intente de nuevo más tarde.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const globalRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 100, // 100 peticiones por minuto por IP
  message: {
    error: 'Demasiadas peticiones. Por favor, espera un momento.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
