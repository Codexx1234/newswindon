import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { trpc } from '@/lib/trpc';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Skeleton } from './ui/skeleton';

interface Testimonial {
  id: number;
  authorName: string;
  authorRole: string | null;
  content: string;
  rating: number | null;
}

// Default testimonials for when database is empty
const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    authorName: 'María González',
    authorRole: 'Mamá de Sofía (8 años)',
    content: 'Mi hija empezó a los 5 años y hoy habla inglés con una fluidez increíble. Los profesores son muy dedicados y el ambiente es excelente. Recomiendo NewSwindon al 100%.',
    rating: 5,
  },
  {
    id: 2,
    authorName: 'Carlos Rodríguez',
    authorRole: 'Gerente de RRHH',
    content: 'Llevamos 15 años trabajando con NewSwindon para la capacitación de nuestro personal. El nivel de profesionalismo y los resultados son excepcionales. Nuestros empleados mejoraron notablemente su comunicación en inglés.',
    rating: 5,
  },
  {
    id: 3,
    authorName: 'Luciana Fernández',
    authorRole: 'Estudiante universitaria',
    content: 'Gracias a NewSwindon aprobé el First Certificate en mi primer intento. La preparación fue excelente y los profesores siempre estuvieron disponibles para resolver mis dudas.',
    rating: 5,
  },
  {
    id: 4,
    authorName: 'Roberto Martínez',
    authorRole: 'Profesional IT',
    content: 'El taller de conversación me ayudó a perder el miedo a hablar en inglés. Ahora puedo participar en reuniones internacionales con confianza. ¡Excelente academia!',
    rating: 5,
  },
  {
    id: 5,
    authorName: 'Ana Pérez',
    authorRole: 'Mamá de Tomás y Martina',
    content: 'Mis dos hijos van a NewSwindon y están encantados. El método de enseñanza es muy dinámico y los chicos aprenden jugando. Los grupos reducidos hacen toda la diferencia.',
    rating: 5,
  },
];

export function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>();

  const { data: dbTestimonials, isLoading } = trpc.testimonials.list.useQuery();
  
  const testimonials = dbTestimonials && dbTestimonials.length > 0 
    ? dbTestimonials 
    : DEFAULT_TESTIMONIALS;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  useEffect(() => {
    if (!isAutoPlaying || !isVisible) return;

    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, isVisible, nextSlide]);

  const handleManualNavigation = (action: () => void) => {
    setIsAutoPlaying(false);
    action();
    // Resume autoplay after 10 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <section id="testimonios" className="py-20 bg-muted/30">
      <div className="container">
        <div 
          ref={ref}
          className={cn('text-center mb-12 fade-in-up', isVisible && 'visible')}
        >
          <span className="badge-primary mb-4">Testimonios</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-4">
            Lo que dicen nuestros alumnos
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Más de 35 años formando estudiantes nos avalan. Conocé las experiencias 
            de quienes confiaron en NewSwindon.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {isLoading ? (
            <div className="bg-card rounded-2xl p-12 border shadow-sm text-center space-y-6">
              <Skeleton className="h-12 w-12 rounded-full mx-auto" />
              <Skeleton className="h-6 w-3/4 mx-auto" />
              <Skeleton className="h-6 w-1/2 mx-auto" />
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-5 w-5 rounded-full" />)}
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-32 mx-auto" />
                <Skeleton className="h-3 w-48 mx-auto" />
              </div>
            </div>
          ) : (
            <>
          {/* Main Carousel */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="w-full flex-shrink-0 px-4"
                >
                  <div className="testimonial-card text-center">
                    <Quote className="w-12 h-12 text-primary/20 mx-auto mb-4" />
                    
                    <p className="text-lg text-foreground mb-6 leading-relaxed">
                      "{testimonial.content}"
                    </p>

                    {/* Rating */}
                    {testimonial.rating && (
                      <div className="flex justify-center gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              'w-5 h-5',
                              i < testimonial.rating!
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                            )}
                          />
                        ))}
                      </div>
                    )}

                    <div>
                      <p className="font-semibold text-foreground">
                        {testimonial.authorName}
                      </p>
                      {testimonial.authorRole && (
                        <p className="text-sm text-muted-foreground">
                          {testimonial.authorRole}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-background shadow-lg hidden md:flex"
            onClick={() => handleManualNavigation(prevSlide)}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-background shadow-lg hidden md:flex"
            onClick={() => handleManualNavigation(nextSlide)}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => handleManualNavigation(() => setCurrentIndex(index))}
                className={cn(
                  'w-2 h-2 rounded-full transition-all duration-300',
                  index === currentIndex
                    ? 'w-8 bg-primary'
                    : 'bg-primary/30 hover:bg-primary/50'
                )}
                aria-label={`Ir al testimonio ${index + 1}`}
              />
            ))}
          </div>
          </>
          )}
        </div>
      </div>
    </section>
  );
}
