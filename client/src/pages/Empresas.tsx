import { Link } from 'wouter';
import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  Users, 
  Target, 
  Clock, 
  Award,
  CheckCircle,
  ArrowRight,
  Briefcase,
  TrendingUp,
  Globe,
  Handshake,
  Phone,
  Mail,
  Calendar,
  Loader2,
  ChevronRight
} from 'lucide-react';
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
import { ContactForm } from '@/components/ContactForm';

// Hero Section for Empresas
function EmpresasHero() {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>();

  return (
    <section className="relative min-h-[70vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-[#e0f2f1]" />
      <div className="absolute inset-0 hero-pattern opacity-20" />

      <div className="container relative z-10">
        <div 
          ref={ref}
          className={cn(
            'max-w-3xl fade-in-up text-foreground',
            isVisible && 'visible'
          )}
        >
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <Building2 className="w-4 h-4" />
            <span className="text-sm font-medium">Soluciones Corporativas</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Capacitación en inglés para empresas
          </h1>

          <p className="text-xl text-foreground/80 mb-8 max-w-2xl font-medium">
            Más de 30 años de experiencia brindando servicios de capacitación en inglés 
            a empresas. Programas personalizados que se adaptan a las necesidades 
            específicas de tu organización.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              asChild 
              size="lg" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 btn-shine text-base"
            >
              <a href="#contacto-empresas">
                Solicitar información
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </Button>
            <Button 
              asChild 
              size="lg" 
              variant="outline" 
              className="border-primary/30 text-primary hover:bg-primary/5 text-base bg-transparent"
            >
              <a href="tel:+5491130707350">
                <Phone className="w-4 h-4 mr-2" />
                Llamar ahora
              </a>
            </Button>
          </div>
        </div>
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

// Stats Section
function StatsSection() {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>();

  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <div 
          ref={ref}
          className={cn('grid grid-cols-2 md:grid-cols-4 gap-8 fade-in-up', isVisible && 'visible')}
        >
          <StatCard value={30} suffix="+" label="Años con empresas" />
          <StatCard value={50} suffix="+" label="Empresas capacitadas" />
          <StatCard value={500} suffix="+" label="Profesionales formados" />
          <StatCard value={98} suffix="%" label="Satisfacción" />
        </div>
      </div>
    </section>
  );
}

function StatCard({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { count, ref } = useCounterAnimation(value, 2000);
  
  return (
    <div className="text-center">
      <span ref={ref} className="text-4xl md:text-5xl font-bold text-primary counter-animate">
        {count}{suffix}
      </span>
      <p className="text-muted-foreground mt-2">{label}</p>
    </div>
  );
}

// Services Section
function ServicesSection() {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>();

  const services = [
    {
      icon: Briefcase,
      title: 'Inglés de Negocios',
      description: 'Comunicación efectiva en reuniones, presentaciones, negociaciones y correspondencia comercial.',
    },
    {
      icon: Globe,
      title: 'Inglés Técnico',
      description: 'Vocabulario especializado según el rubro de tu empresa: IT, finanzas, legal, medicina, etc.',
    },
    {
      icon: Users,
      title: 'Clases Grupales',
      description: 'Grupos reducidos de empleados con niveles similares para un aprendizaje efectivo.',
    },
    {
      icon: Target,
      title: 'Clases Individuales',
      description: 'Atención personalizada para ejecutivos y personal clave con objetivos específicos.',
    },
    {
      icon: TrendingUp,
      title: 'Evaluación de Nivel',
      description: 'Diagnóstico inicial y evaluaciones periódicas para medir el progreso de los participantes.',
    },
    {
      icon: Award,
      title: 'Certificación',
      description: 'Preparación para exámenes internacionales Cambridge y certificados de nivel.',
    },
  ];

  return (
    <section className="py-20">
      <div className="container">
        <div 
          ref={ref}
          className={cn('text-center mb-12 fade-in-up', isVisible && 'visible')}
        >
          <span className="badge-primary mb-4">Servicios</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-4">
            Soluciones a medida para tu empresa
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Diseñamos programas de capacitación adaptados a los objetivos y necesidades 
            específicas de cada organización.
          </p>
        </div>

        <div className={cn('grid md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children', isVisible && 'visible')}>
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl p-6 border shadow-sm card-hover"
            >
              <div className="icon-container mb-4">
                <service.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
              <p className="text-muted-foreground text-sm">{service.description}</p>
            </div>
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
    'Programas 100% personalizados según objetivos',
    'Modalidad in-company o en nuestras instalaciones',
    'Horarios flexibles adaptados a la empresa',
    'Profesores especializados en inglés de negocios',
    'Material didáctico incluido',
    'Informes de progreso periódicos',
    'Evaluaciones de nivel sin cargo',
    'Más de 30 años de experiencia comprobada',
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div 
            ref={ref}
            className={cn('slide-in-left', isVisible && 'visible')}
          >
            <span className="badge-accent mb-4">Beneficios</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-6">
              ¿Por qué elegirnos?
            </h2>
            <p className="text-muted-foreground mb-8">
              Nuestro mayor orgullo es mantener una relación de más de 30 años 
              brindando servicios de capacitación a empresas. Esta continuidad 
              demuestra la calidad y confianza que generamos.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={cn('slide-in-right', isVisible && 'visible')}>
            <div className="relative">
              <div className="bg-primary/10 rounded-3xl p-8">
                <div className="bg-card rounded-2xl p-8 shadow-xl">
                  <Handshake className="w-16 h-16 text-primary mb-6" />
                  <h3 className="text-2xl font-bold mb-4">
                    30+ años de confianza
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Una empresa confió en nosotros hace más de 30 años y seguimos 
                    siendo su proveedor de capacitación en inglés. Ese es nuestro 
                    mejor testimonio.
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex -space-x-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div 
                          key={i}
                          className="w-8 h-8 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center"
                        >
                          <Users className="w-4 h-4 text-primary" />
                        </div>
                      ))}
                    </div>
                    <span>+500 profesionales capacitados</span>
                  </div>
                </div>
              </div>
              
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/20 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Process Section
function ProcessSection() {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>();

  const steps = [
    {
      number: '01',
      title: 'Diagnóstico',
      description: 'Evaluamos el nivel actual y las necesidades específicas de tu equipo.',
    },
    {
      number: '02',
      title: 'Propuesta',
      description: 'Diseñamos un programa personalizado con objetivos claros y medibles.',
    },
    {
      number: '03',
      title: 'Implementación',
      description: 'Iniciamos las clases con profesores especializados y material a medida.',
    },
    {
      number: '04',
      title: 'Seguimiento',
      description: 'Evaluamos el progreso y ajustamos el programa según los resultados.',
    },
  ];

  return (
    <section className="py-20">
      <div className="container">
        <div 
          ref={ref}
          className={cn('text-center mb-12 fade-in-up', isVisible && 'visible')}
        >
          <span className="badge-primary mb-4">Proceso</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-4">
            ¿Cómo trabajamos?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Un proceso simple y efectivo para implementar la capacitación en tu empresa.
          </p>
        </div>

        <div className={cn('grid md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children', isVisible && 'visible')}>
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-card rounded-2xl p-6 border shadow-sm h-full">
                <span className="text-5xl font-bold text-primary/20">{step.number}</span>
                <h3 className="text-xl font-semibold mt-2 mb-3">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                  <ArrowRight className="w-6 h-6 text-primary/30" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Contact Section for Empresas
function ContactSection() {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>();

  return (
    <section id="contacto-empresas" className="py-20 bg-muted/30">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12">
          <div 
            ref={ref}
            className={cn('slide-in-left', isVisible && 'visible')}
          >
            <span className="badge-primary mb-4">Contacto</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-6">
              Solicitá una propuesta
            </h2>
            <p className="text-muted-foreground mb-8">
              Completá el formulario con los datos de tu empresa y nos pondremos 
              en contacto para diseñar una propuesta a medida.
            </p>

            <div className="space-y-6">
              <a 
                href="tel:+5491130707350" 
                className="flex items-center gap-4 p-4 rounded-xl bg-card border hover:border-primary transition-colors"
              >
                <div className="icon-container">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">Teléfono directo</p>
                  <p className="text-muted-foreground">15 3070-7350</p>
                </div>
              </a>

              <a 
                href="mailto:swindoncollege2@gmail.com" 
                className="flex items-center gap-4 p-4 rounded-xl bg-card border hover:border-primary transition-colors"
              >
                <div className="icon-container">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">Email corporativo</p>
                  <p className="text-muted-foreground">swindoncollege2@gmail.com</p>
                </div>
              </a>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-card border">
                <div className="icon-container">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">Horario de atención</p>
                  <p className="text-muted-foreground">Lunes a Viernes: 9:00 - 18:00</p>
                </div>
              </div>
            </div>
          </div>

          <div className={cn('slide-in-right space-y-6', isVisible && 'visible')}>
            <ContactForm contactType="empresa" />
            
            <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">¿Preferís una reunión?</h4>
                  <p className="text-sm text-muted-foreground">Agendá una consulta corporativa en segundos</p>
                </div>
              </div>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full btn-shine bg-primary hover:bg-primary/90">
                    Agendar Reunión Informativa
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none">
                  <AppointmentBookingForm defaultType="empresa" />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Main Empresas Page
function AppointmentBookingForm({ defaultType = 'entrevista_nivel' }: { defaultType?: 'entrevista_nivel' | 'consulta_general' | 'empresa' }) {
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
    appointmentType: defaultType,
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
            href={`https://wa.me/5491130707350?text=Hola!%20Acabo%20de%20agendar%20una%20reunión%20informativa%20para%20el%20día%20${selectedDate?.toLocaleDateString()}%20a%20las%20${selectedHour}.`} 
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
          <DialogTitle className="text-2xl font-bold text-white">Agendar Reunión</DialogTitle>
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
                      variant={selectedHour === hour ? "primary" : "outline"}
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

export default function Empresas() {
  return (
    <>
      <Helmet 
        title="Empresas" 
        description="Capacitación en inglés para empresas con más de 30 años de experiencia. Programas personalizados de Business English e inglés técnico." 
      />
      <EmpresasHero />
      <StatsSection />
      <ServicesSection />
      <BenefitsSection />
      <ProcessSection />
      <ContactSection />
    </>
  );
}
