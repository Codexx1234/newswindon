import { Link } from 'wouter';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Linkedin } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const handleNavClick = (href: string) => {
    if (href.startsWith('/#')) {
      const elementId = href.substring(2);
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="bg-foreground text-background">
      {/* Main Footer */}
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">N</span>
              </div>
              <div>
                <h3 className="font-bold text-xl">NewSwindon</h3>
                <p className="text-sm text-background/70">Academia de Inglés</p>
              </div>
            </div>
            <p className="text-background/80 text-sm leading-relaxed mb-4">
              35 años formando estudiantes de todas las edades. Especialistas en preparación 
              para exámenes Cambridge y capacitación empresarial.
            </p>
            <div className="flex gap-3">
              <a 
                href="https://facebook.com/newswindon" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://instagram.com/newswindon" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://linkedin.com/company/newswindon" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-3">
              {[
                { href: '/', label: 'Inicio' },
                { href: '/#cursos', label: 'Cursos' },
                { href: '/#nosotros', label: 'Nosotros' },
                { href: '/empresas', label: 'Empresas' },
                { href: '/#testimonios', label: 'Testimonios' },
                { href: '/#contacto', label: 'Contacto' },
              ].map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    onClick={() => handleNavClick(link.href)}
                    className="text-background/80 hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Nuestros Cursos</h4>
            <ul className="space-y-3 text-sm text-background/80">
              <li>Inglés para Niños (desde 3 años)</li>
              <li>Inglés para Jóvenes y Adultos</li>
              <li>Preparación Cambridge (FCE, CPE)</li>
              <li>Taller de Conversación</li>
              <li>Ingreso a Profesorado</li>
              <li>Capacitación Empresarial</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contacto</h4>
            <ul className="space-y-4">
              <li>
                <a 
                  href="tel:+5491130707350" 
                  className="flex items-start gap-3 text-background/80 hover:text-primary transition-colors"
                >
                  <Phone className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">15 3070-7350</span>
                </a>
              </li>
              <li>
                <a 
                  href="mailto:swindoncollege2@gmail.com" 
                  className="flex items-start gap-3 text-background/80 hover:text-primary transition-colors"
                >
                  <Mail className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">swindoncollege2@gmail.com</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-background/80">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Carapachay, Buenos Aires, Argentina</span>
              </li>
              <li className="flex items-start gap-3 text-background/80">
                <Clock className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Lunes a Viernes: 9:00 - 21:00<br />Sábados: 9:00 - 13:00</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-background/60">
            <p>© {currentYear} NewSwindon - Academia de Inglés. Todos los derechos reservados.</p>
            <div className="flex gap-6">
              <span>Sin matrícula</span>
              <span>•</span>
              <span>Sin derecho de examen</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
