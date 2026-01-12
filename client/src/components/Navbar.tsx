import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, X, Phone, Mail, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/#cursos', label: 'Cursos' },
  { href: '/#nosotros', label: 'Nosotros' },
  { href: '/empresas', label: 'Empresas' },
  { href: '/#testimonios', label: 'Testimonios' },
  { href: '/#contacto', label: 'Contacto' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    
    if (href.startsWith('/#')) {
      const elementId = href.substring(2);
      if (location === '/') {
        const element = document.getElementById(elementId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  return (
    <>
      {/* Top bar with contact info */}
      <div className="hidden md:block bg-primary text-primary-foreground py-2">
        <div className="container flex justify-between items-center text-sm">
          <div className="flex items-center gap-6">
            <a href="tel:+5491130707350" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Phone className="w-4 h-4" />
              <span>15 3070-7350</span>
            </a>
            <a href="mailto:swindoncollege2@gmail.com" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Mail className="w-4 h-4" />
              <span>swindoncollege2@gmail.com</span>
            </a>
          </div>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            <span>35 años formando estudiantes</span>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <header
        className={cn(
          'sticky top-0 z-50 w-full transition-all duration-300',
          isScrolled
            ? 'bg-background/95 backdrop-blur-md shadow-md'
            : 'bg-background/80 backdrop-blur-sm'
        )}
      >
        <div className="container">
          <nav className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary flex items-center justify-center transition-transform group-hover:scale-105">
                <span className="text-primary-foreground font-bold text-lg md:text-xl">N</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg md:text-xl text-foreground">NewSwindon</span>
                <span className="text-xs text-muted-foreground hidden sm:block">Academia de Inglés</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className={cn(
                    'px-4 py-2 text-sm font-medium rounded-lg transition-colors nav-link',
                    location === link.href
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden lg:flex items-center gap-4">
              <Button 
                asChild 
                className="btn-shine bg-primary hover:bg-primary/90"
              >
                <Link href="/#contacto" onClick={() => handleNavClick('/#contacto')}>
                  Inscribite Ahora
                </Link>
              </Button>
            </div>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Abrir menú</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                        <span className="text-primary-foreground font-bold text-lg">N</span>
                      </div>
                      <span className="font-bold text-lg">NewSwindon</span>
                    </div>
                  </div>

                  <nav className="flex flex-col gap-2">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => handleNavClick(link.href)}
                        className={cn(
                          'px-4 py-3 text-base font-medium rounded-lg transition-colors',
                          location === link.href
                            ? 'text-primary bg-primary/10'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                        )}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>

                  <div className="mt-auto pt-8 border-t">
                    <div className="flex flex-col gap-3 mb-6">
                      <a href="tel:+5491130707350" className="flex items-center gap-3 text-muted-foreground hover:text-foreground">
                        <Phone className="w-5 h-5" />
                        <span>15 3070-7350</span>
                      </a>
                      <a href="mailto:swindoncollege2@gmail.com" className="flex items-center gap-3 text-muted-foreground hover:text-foreground">
                        <Mail className="w-5 h-5" />
                        <span>swindoncollege2@gmail.com</span>
                      </a>
                    </div>
                    <Button 
                      asChild 
                      className="w-full btn-shine"
                    >
                      <Link href="/#contacto" onClick={() => handleNavClick('/#contacto')}>
                        Inscribite Ahora
                      </Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </nav>
        </div>
      </header>
    </>
  );
}
