import { Link } from 'wouter';
import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { 
  GraduationCap, 
  Users, 
  Award, 
  BookOpen, 
  MessageSquare, 
  Building2,
  CheckCircle,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  Globe,
  Clock,
  Star,
  Calendar as CalendarIcon,
  Loader2,
  ChevronRight
} from 'lucide-react';
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useScrollAnimation, useCounterAnimation } from '@/hooks/useScrollAnimation';
import { TestimonialsCarousel } from '@/components/TestimonialsCarousel';
import { ContactForm } from '@/components/ContactForm';
import { GallerySection } from '@/components/GallerySection';
import { motion } from 'framer-motion';

// Hero Section
function HeroSection() {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>({ threshold: 0.1 });
  const { count: yearsCount, ref: yearsRef } = useCounterAnimation(35, 2000);
  const { count: studentsCount, ref: studentsRef } = useCounterAnimation(1000, 2500);
  const { count: companiesCount, ref: companiesRef } = useCounterAnimation(30, 2000);

  return (
    <section id="inicio" className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 animated-gradient" />
      <div className="absolute inset-0 hero-pattern" />
      
      {/* Floating Elements */}
      <motion.div 
        animate={{ y: [0, -20, 0], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl" 
      />
      <motion.div 
        animate={{ y: [0, 30, 0], opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl" 
      />
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-1/2 right-1/4 w-16 h-16 bg-white/10 rounded-full blur-xl" 
      />

      <div className="container relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto text-center text-white"
        >
          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Aprendé inglés en{' '}
            <span className="relative">
              NewSwindon
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                <path d="M2 10C50 4 150 2 298 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-white/50"/>
              </svg>
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
            Instituto de inglés con más de tres décadas formando estudiantes de todas las edades. 
            Grupos reducidos, profesores especializados y metodología efectiva.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              asChild 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 btn-shine text-lg px-8"
            >
              <a href="#contacto">
                Inscribite ahora
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
            </Button>
            <Button 
              asChild 
              size="lg" 
              variant="outline" 
              className="border-white/30 text-white hover:bg-white/10 text-lg px-8"
            >
              <a href="#cursos">
                Ver cursos
              </a>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pb-16">
            <div className="text-center">
              <span ref={yearsRef} className="text-4xl md:text-5xl font-bold counter-animate">
                {yearsCount}+
              </span>
              <p className="text-white text-sm mt-1 font-medium">Años de experiencia</p>
            </div>
            <div className="text-center">
              <span ref={studentsRef} className="text-4xl md:text-5xl font-bold counter-animate">
                {studentsCount}+
              </span>
              <p className="text-white text-sm mt-1 font-medium">Alumnos formados</p>
            </div>
            <div className="text-center">
              <span ref={companiesRef} className="text-4xl md:text-5xl font-bold counter-animate">
                {companiesCount}+
              </span>
              <p className="text-white text-sm mt-1 font-medium">Años con empresas</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" className="w-full h-auto">
          <path 
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" 
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  );
}

// About Section
function AboutSection() {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>({ threshold: 0.2 });

  return (
    <section id="nosotros" className="py-20">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div 
            ref={ref}
            className={cn('slide-in-left flex flex-col items-center text-center lg:items-start lg:text-left', isVisible && 'visible')}
          >
            <span className="badge-primary mb-4">Sobre Nosotros</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-6">
              Más de 35 años formando estudiantes de excelencia
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Más de <strong className="text-foreground">35 años</strong> formando estudiantes en Carapachay, Buenos Aires. 
              Grupos reducidos, profesores certificados y metodología moderna para un aprendizaje efectivo y personalizado.
            </p>

            {/* Features List */}
            <div className="grid sm:grid-cols-2 gap-4 w-full">
              {[
                'Profesores especializados',
                'Grupos reducidos',
                'Metodología comunicativa',
                'Recursos multimedios',
                'Seguimiento personalizado',
                'Ambiente cálido y profesional',
              ].map((feature) => (
                <div key={feature} className="flex items-center justify-center lg:justify-start gap-2">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-sm font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Image/Stats Card */}
          <div className={cn('slide-in-right', isVisible && 'visible')}>
            <div className="relative">
              {/* Main Card */}
              <div className="bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-8 text-white">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-4 bg-white/10 rounded-2xl">
                    <GraduationCap className="w-10 h-10 mx-auto mb-2" />
                    <p className="text-3xl font-bold">35+</p>
                    <p className="text-sm text-white/80">Años de experiencia</p>
                  </div>
                  <div className="text-center p-4 bg-white/10 rounded-2xl">
                    <Users className="w-10 h-10 mx-auto mb-2" />
                    <p className="text-3xl font-bold">1000+</p>
                    <p className="text-sm text-white/80">Alumnos formados</p>
                  </div>
                  <div className="text-center p-4 bg-white/10 rounded-2xl">
                    <Building2 className="w-10 h-10 mx-auto mb-2" />
                    <p className="text-3xl font-bold">30+</p>
                    <p className="text-sm text-white/80">Años con empresas</p>
                  </div>
                  <div className="text-center p-4 bg-white/10 rounded-2xl">
                    <Award className="w-10 h-10 mx-auto mb-2" />
                    <p className="text-3xl font-bold">100%</p>
                    <p className="text-sm text-white/80">Compromiso</p>
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-24 -right-16 bg-card rounded-2xl shadow-xl p-6 border hidden md:block">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
                  </div>
                  <div>
                    <p className="text-xl font-bold">4.9/5</p>
                    <p className="text-sm text-muted-foreground">Calificación promedio</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Courses Section
function CoursesSection() {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>({ threshold: 0.2 });

  const courses = [
    {
      icon: Users,
      title: 'Inglés para Niños',
      description: 'Desde los 3 años, con metodología lúdica y grupos reducidos para un aprendizaje natural y divertido.',
      features: ['Desde 3 años', 'Metodología lúdica', 'Grupos reducidos'],
    },
    {
      icon: BookOpen,
      title: 'Inglés General',
      description: 'Cursos para jóvenes y adultos de todos los niveles, con enfoque comunicativo y práctico.',
      features: ['Todos los niveles', 'Enfoque comunicativo', 'Horarios flexibles'],
    },
    {
      icon: Award,
      title: 'Exámenes Cambridge',
      description: 'Preparación intensiva para First Certificate (FCE) y Proficiency (CPE) con alto índice de aprobación.',
      features: ['First Certificate', 'Proficiency', 'Alto índice de aprobación'],
    },
    {
      icon: MessageSquare,
      title: 'Taller de Conversación',
      description: 'Práctica intensiva de conversación para ganar fluidez y confianza al hablar inglés.',
      features: ['Práctica intensiva', 'Grupos pequeños', 'Temas actuales'],
    },
    {
      icon: GraduationCap,
      title: 'Ingreso a Profesorado',
      description: 'Preparación completa para el ingreso a carreras de profesorado y traductorado de inglés.',
      features: ['Profesorado', 'Traductorado', 'Preparación integral'],
    },
    {
      icon: Building2,
      title: 'Inglés Corporativo',
      description: 'Más de 30 años de relación con una empresa líder. Programas personalizados según las necesidades de cada organización.',
      features: ['In-company', 'Programas a medida', '30+ años con 1 empresa'],
    },
  ];

  return (
    <section id="cursos" className="py-20 bg-muted/30">
      <div className="container">
        <div 
          ref={ref}
          className={cn('text-center mb-12 fade-in-up', isVisible && 'visible')}
        >
          <span className="badge-primary mb-4">Nuestros Cursos</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-4">
            Programas para todas las edades y necesidades
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ofrecemos una amplia variedad de cursos diseñados para adaptarse a tus objetivos, 
            desde el aprendizaje inicial hasta la preparación para exámenes internacionales.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <motion.div
              key={course.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
              className="bg-card rounded-2xl p-8 border shadow-sm hover:shadow-xl transition-shadow flex flex-col items-center text-center"
            >
              <div className="icon-container mb-6">
                <course.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">{course.title}</h3>
              <p className="text-muted-foreground text-sm mb-6 leading-relaxed">{course.description}</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {course.features.map((feature) => (
                  <span key={feature} className="text-xs px-3 py-1 bg-primary/5 text-primary rounded-full font-medium">
                    {feature}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Benefits Section
function BenefitsSection() {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>();

  const benefits = [
    {
      icon: CheckCircle,
      title: 'Sin matrícula',
      description: 'No cobramos matrícula de inscripción. Solo abonás las clases.',
    },
    {
      icon: Award,
      title: 'Sin derecho de examen',
      description: 'Los exámenes internos no tienen costo adicional.',
    },
    {
      icon: Users,
      title: 'Grupos reducidos',
      description: 'Máximo 8 alumnos por grupo para una atención personalizada.',
    },
    {
      icon: Globe,
      title: 'Recursos multimedios',
      description: 'Revistas, DVDs, videos y CDs para un aprendizaje dinámico.',
    },
    {
      icon: Clock,
      title: 'Horarios flexibles',
      description: 'Múltiples opciones de horarios para adaptarnos a tu rutina.',
    },
    {
      icon: GraduationCap,
      title: 'Profesores certificados',
      description: 'Docentes especializados con formación continua.',
    },
  ];

  return (
    <section id="beneficios" className="py-20">
      <div className="container">
        <div 
          ref={ref}
          className={cn('text-center mb-12 fade-in-up', isVisible && 'visible')}
        >
          <span className="badge-accent mb-4">Beneficios</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-4">
            ¿Por qué elegir NewSwindon?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Nos diferenciamos por nuestra calidad educativa, compromiso con el alumno 
            y beneficios exclusivos que hacen más accesible el aprendizaje del inglés.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center text-center p-8 rounded-2xl bg-card border shadow-sm hover:shadow-lg transition-all"
            >
              <div className="icon-container mb-6">
                <benefit.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// CTA Section for Empresas
function EmpresasCTA() {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>();

  return (
    <section id="empresas" className="py-20 bg-muted/30">
      <div className="container">
        <div 
          ref={ref}
          className={cn(
            'gradient-primary rounded-3xl p-8 md:p-12 text-white text-center',
            'fade-in-up',
            isVisible && 'visible'
          )}
        >
          <Building2 className="w-16 h-16 mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Capacitación para Empresas
          </h2>
          <p className="text-xl text-white mb-8 max-w-2xl mx-auto font-medium">
            Más de 30 años de relación con una empresa líder, brindando servicios de capacitación en inglés de excelencia. 
            Programas personalizados, modalidad in-company y resultados comprobados.
          </p>
          <Button 
            asChild 
            size="lg" 
            className="bg-white text-primary hover:bg-white/90 btn-shine"
          >
            <Link href="/empresas">
              Conocé más
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

// Contact Section
function ContactSection() {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>();

  return (
    <section id="contacto" className="py-20">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Info */}
          <div 
            ref={ref}
            className={cn('slide-in-left space-y-6', isVisible && 'visible')}
          >
            <span className="badge-primary mb-4">Contacto</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-6">
              ¿Listo para empezar?
            </h2>
            <p className="text-muted-foreground mb-8">
              Completá el formulario y nos pondremos en contacto a la brevedad para 
              brindarte toda la información que necesitás. También podés contactarnos 
              directamente por estos medios.
            </p>

            <div className="grid gap-4">
              <a 
                href="tel:+5491130707350" 
                className="flex items-center gap-4 p-6 rounded-2xl bg-muted/50 hover:bg-muted transition-colors border border-transparent hover:border-primary/20"
              >
                <div className="icon-container">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold">Teléfono / WhatsApp</p>
                  <p className="text-muted-foreground">15 3070-7350</p>
                </div>
              </a>

              <a 
                href="mailto:swindoncollege2@gmail.com" 
                className="flex items-center gap-4 p-6 rounded-2xl bg-muted/50 hover:bg-muted transition-colors border border-transparent hover:border-primary/20"
              >
                <div className="icon-container">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold">Email</p>
                  <p className="text-muted-foreground">swindoncollege2@gmail.com</p>
                </div>
              </a>

              <div className="flex items-center gap-4 p-6 rounded-2xl bg-muted/50 border border-transparent hover:border-primary/20">
                <div className="icon-container">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold">Ubicación</p>
                  <p className="text-muted-foreground">Carapachay, Buenos Aires, Argentina</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className={cn('slide-in-right lg:mt-24 space-y-6', isVisible && 'visible')}>
            <ContactForm />
            
            <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white">
                  <CalendarIcon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">¿Preferís una entrevista?</h4>
                  <p className="text-sm text-muted-foreground">Agendá tu nivelación sin cargo en segundos</p>
                </div>
              </div>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full btn-shine bg-primary hover:bg-primary/90">
                    Agendar Entrevista de Nivel
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none">
                  <AppointmentBookingForm />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AppointmentBookingForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedHour, setSelectedHour] = useState<string | undefined>(undefined);

  const bookMutation = trpc.appointments.book.useMutation({
    onSuccess: () => {
      setIsSubmitted(true);
      toast.success('¡Reserva enviada!', {
        description: 'Te confirmaremos la cita a la brevedad.',
      });
    },
    onError: (error) => {
      toast.error('Error al reservar', {
        description: error.message || 'Por favor, intentá de nuevo.',
      });
    },
  });

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    appointmentType: 'entrevista_nivel' as const,
    notes: '',
  });

  const hours = Array.from({ length: 10 }, (_, i) => `${i + 10}:00`);

  const isDayDisabled = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 5 || day === 6 || date < new Date(new Date().setHours(0,0,0,0));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedHour) return;

    const [hour] = selectedHour.split(':');
    const appointmentDate = new Date(selectedDate);
    appointmentDate.setHours(parseInt(hour), 0, 0, 0);
    
    bookMutation.mutate({
      ...formData,
      appointmentDate,
    });
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-8 px-6 bg-card">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold mb-2">¡Cita Agendada!</h3>
        <p className="text-muted-foreground mb-6">
          Recibimos tu solicitud correctamente. 
          Nos pondremos en contacto con vos para confirmar el horario.
        </p>
        <Button asChild className="bg-[#25D366] hover:bg-[#128C7E] text-white w-full">
          <a 
            href={`https://wa.me/5491130707350?text=Hola!%20Acabo%20de%20agendar%20una%20entrevista%20de%20nivelación%20para%20el%20día%20${selectedDate?.toLocaleDateString()}%20a%20las%20${selectedHour}.`} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Avisar por WhatsApp
          </a>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col max-h-[90vh] overflow-y-auto">
      <div className="bg-primary p-6 text-white sticky top-0 z-10">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">Agendar Entrevista</DialogTitle>
          <p className="text-primary-foreground/80 text-sm mt-1">
            {step === 1 ? 'Paso 1: Elegí día y hora' : 'Paso 2: Completá tus datos'}
          </p>
        </DialogHeader>
      </div>
      
      <div className="p-6 bg-card">
        {step === 1 ? (
          <div className="space-y-6">
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={isDayDisabled}
                className="rounded-md border shadow-sm"
              />
            </div>
            
            {selectedDate && (
              <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                <Label className="text-sm font-bold flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Horarios disponibles (Lun-Jue)
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {hours.map((hour) => (
                    <Button
                      key={hour}
                      variant={selectedHour === hour ? "default" : "outline"}
                      className={cn(
                        "h-10 text-sm font-medium",
                        selectedHour === hour && "bg-primary text-white"
                      )}
                      onClick={() => setSelectedHour(hour)}
                    >
                      {hour}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <Button 
              className="w-full h-12 mt-4" 
              disabled={!selectedDate || !selectedHour}
              onClick={() => setStep(2)}
            >
              Continuar <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="bg-muted/50 p-3 rounded-lg text-sm mb-4 flex justify-between items-center">
              <div>
                <p className="font-bold text-primary">Horario seleccionado:</p>
                <p>{selectedDate?.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })} a las {selectedHour}hs</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setStep(1)} className="text-xs">Cambiar</Button>
            </div>

            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="book-name" className="text-sm font-semibold">Nombre completo *</Label>
                <Input 
                  id="book-name" 
                  placeholder="Tu nombre"
                  required 
                  className="input-focus"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="book-email" className="text-sm font-semibold">Email *</Label>
                  <Input 
                    id="book-email" 
                    type="email" 
                    placeholder="tu@email.com"
                    required 
                    className="input-focus"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="book-phone" className="text-sm font-semibold">Teléfono *</Label>
                  <Input 
                    id="book-phone" 
                    type="tel" 
                    placeholder="Tu teléfono"
                    required 
                    className="input-focus"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="book-type" className="text-sm font-semibold">Motivo de la cita</Label>
                <Select 
                  value={formData.appointmentType}
                  onValueChange={(value) => setFormData({ ...formData, appointmentType: value as any })}
                >
                  <SelectTrigger className="input-focus">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entrevista_nivel">Entrevista de Nivelación</SelectItem>
                    <SelectItem value="consulta_general">Consulta General</SelectItem>
                    <SelectItem value="empresa">Consulta para Empresas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full btn-shine h-12 text-base font-bold" 
              disabled={bookMutation.isPending}
            >
              {bookMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Procesando...
                </>
              ) : (
                'Confirmar Reserva'
              )}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

import { Helmet } from "@/components/Helmet";

export default function Home() {
  return (
    <>
      <Helmet 
        title="Inicio" 
        description="Academia de inglés en Carapachay con 35 años de experiencia. Clases para niños, adolescentes y adultos. Preparación para exámenes Cambridge." 
      />
      <HeroSection />
      <AboutSection />
      <CoursesSection />
      <BenefitsSection />
      <GallerySection />
      <TestimonialsCarousel />
      <EmpresasCTA />
      <ContactSection />
    </>
  );
}
