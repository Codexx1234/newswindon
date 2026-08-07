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
import { useContent } from '@/hooks/useContent';
import { TestimonialsCarousel } from '@/components/TestimonialsCarousel';
import { ContactForm } from '@/components/ContactForm';
import { GallerySection } from '@/components/GallerySection';
import { motion } from 'framer-motion';

// Hero Section
function HeroSection() {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>({ threshold: 0.1 });
  const { count: yearsCount, ref: yearsRef } = useCounterAnimation(35, 2000);

  // Load dynamic content with backup system
  const heroTitle = useContent('hero_title', 'Aprendé inglés en NewSwindon');
  const heroSubtitle = useContent('hero_subtitle', 'Instituto con más de tres décadas formando estudiantes de excelencia.');
  const ctaPrimary = useContent('hero_cta_primary', 'Inscribite ahora');
  const ctaSecondary = useContent('hero_cta_secondary', 'Ver cursos');

  return (
    <section id="inicio" className="relative min-h-[90vh] flex items-center overflow-hidden bg-background">
      {/* Abstract Creative Background */}
      <div className="absolute top-0 right-0 w-2/3 h-full bg-primary/5 [clip-path:polygon(20%_0%,100%_0,100%_100%,0%_100%)] z-0" />
      <div className="absolute top-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-[100px] z-0" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-primary/20 rounded-full blur-[80px] z-0" />

      <div className="container relative z-10 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-xl"
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-6 border border-primary/20">
              <Sparkles className="w-4 h-4 inline-block mr-2" />
              Más de 35 años de experiencia
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight text-foreground tracking-tight">
              {heroTitle.split(' ').map((word, i) => (
                word.toLowerCase() === 'inglés' || word.toLowerCase() === 'newswindon' ?
                <span key={i} className="text-primary block"> {word}</span> :
                <span key={i}> {word}</span>
              ))}
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              {heroSubtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="bg-primary text-white hover:bg-primary/90 shadow-xl shadow-primary/25 rounded-2xl h-14 px-8 text-lg btn-enhanced"
              >
                <a href="#contacto">
                  {ctaPrimary}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-2 border-primary/20 text-foreground hover:bg-primary/5 rounded-2xl h-14 px-8 text-lg"
              >
                <a href="#cursos">
                  {ctaSecondary}
                </a>
              </Button>
            </div>

            <div className="mt-12 flex items-center gap-8 text-sm font-medium text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-accent" />
                Grupos reducidos
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-accent" />
                Profesores nativos
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative hidden lg:block h-[600px]"
          >
            {/* Scrapbook Creative Layout */}
            <div className="absolute top-10 right-0 w-72 h-80 z-20 polaroid polaroid-right">
              <div className="w-full h-full bg-muted overflow-hidden img-zoom-container">
                <img src="https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Students learning" className="w-full h-full object-cover" />
              </div>
              <p className="text-center mt-3 font-medium text-foreground text-sm">Clases Dinámicas</p>
            </div>

            <div className="absolute bottom-20 left-10 w-80 h-64 z-30 polaroid">
              <div className="w-full h-full bg-muted overflow-hidden img-zoom-container">
                <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Students together" className="w-full h-full object-cover" />
              </div>
              <p className="text-center mt-3 font-medium text-foreground text-sm">Comunidad NewSwindon</p>
            </div>

            {/* Stats Blob */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary text-white rounded-full flex flex-col items-center justify-center z-40 shadow-2xl border-4 border-background p-6">
              <span ref={yearsRef} className="text-4xl font-black">{yearsCount}+</span>
              <span className="text-sm font-medium text-center leading-tight">Años formando líderes</span>
            </div>

            {/* Decorative element */}
            <div className="absolute -bottom-10 right-20 w-24 h-24 bg-accent/20 rounded-tl-full rounded-br-full z-10" />
            <div className="absolute top-0 left-20 w-16 h-16 bg-primary/20 rounded-tr-full rounded-bl-full z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// About Section
function AboutSection() {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>({ threshold: 0.2 });

  return (
    <section id="nosotros" className="py-24 bg-primary/5 relative overflow-hidden">
      {/* Decorative Blob */}
      <div className="absolute top-0 right-0 w-full h-full opacity-30 pointer-events-none">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="absolute -right-20 -top-20 w-96 h-96 fill-primary">
          <path d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.3,-46.3C90.8,-33.5,96.9,-17.9,96.4,-2.5C95.9,12.9,88.7,28.2,78.2,40.7C67.7,53.2,53.9,62.9,39.1,69.5C24.3,76.1,8.5,79.5,-6.6,80.7C-21.7,81.9,-36.1,80.9,-49.6,74.5C-63.1,68.1,-75.7,56.3,-83.5,41.9C-91.3,27.5,-94.3,10.5,-91.3,-5.1C-88.3,-20.7,-79.3,-35,-68.2,-46C-57.1,-57,-43.9,-64.7,-30.5,-72.1C-17.1,-79.5,-3.5,-86.6,10.6,-88.3C24.7,-90,30.5,-83.6,44.7,-76.4Z" transform="translate(100 100)" />
        </svg>
      </div>

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Creative Image Composition */}
          <div className={cn('slide-in-left relative', isVisible && 'visible')}>
            <div className="relative aspect-square w-full max-w-md mx-auto">
              <div className="absolute inset-0 bg-accent rounded-[30%_70%_70%_30%/30%_30%_70%_70%] shadow-lg transition-all duration-500 hover:rounded-[70%_30%_30%_70%/70%_70%_30%_30%]" />
              <img
                src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Teacher helping students"
                className="absolute inset-2 w-[calc(100%-16px)] h-[calc(100%-16px)] object-cover rounded-[30%_70%_70%_30%/30%_30%_70%_70%] transition-all duration-500 hover:rounded-[70%_30%_30%_70%/70%_70%_30%_30%]"
              />

              {/* Glassmorphism Stats Card */}
              <div className="absolute -bottom-8 -right-8 glass-effect p-6 rounded-2xl max-w-[200px] z-20">
                <div className="flex items-center gap-4 mb-2">
                  <div className="bg-primary/20 p-2 rounded-full">
                    <Star className="w-6 h-6 text-primary fill-primary" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-foreground">4.9/5</h4>
                  </div>
                </div>
                <p className="text-sm font-medium text-muted-foreground">Calificación promedio de nuestros alumnos</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div 
            ref={ref}
            className={cn('slide-in-right flex flex-col', isVisible && 'visible')}
          >
            <div className="inline-flex items-center w-max px-4 py-2 rounded-full bg-background border border-border shadow-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-accent mr-2 animate-pulse"></span>
              <span className="text-sm font-semibold tracking-wide">SOBRE NOSOTROS</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
              Enseñanza que <span className="text-primary relative inline-block">transforma<svg className="absolute w-full h-3 -bottom-1 left-0 text-accent/50" viewBox="0 0 100 20" preserveAspectRatio="none"><path d="M0 10 Q 50 20 100 10" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/></svg></span> tu futuro
            </h2>
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed font-light">
              Desde hace más de <strong className="font-semibold text-foreground">35 años</strong> formamos estudiantes en Carapachay.
              Nuestra metodología combina la calidez humana con recursos innovadores para un aprendizaje efectivo.
            </p>

            {/* Features List with Custom Design */}
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { title: 'Profesores Especializados', icon: GraduationCap, desc: 'Equipo docente en constante formación.' },
                { title: 'Grupos Reducidos', icon: Users, desc: 'Atención 100% personalizada por alumno.' },
                { title: 'Inglés Corporativo', icon: Building2, desc: 'Más de 30 años con empresas líderes.' },
                { title: 'Exámenes Internacionales', icon: Award, desc: 'Preparación para Cambridge FCE/CPE.' },
              ].map((feature, idx) => (
                <div key={idx} className="flex gap-4 group">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-background border shadow-sm flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground leading-snug">{feature.desc}</p>
                  </div>
                </div>
              ))}
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
      title: 'Inglés para Niños',
      description: 'Desde los 3 años, metodología lúdica y grupos reducidos para un aprendizaje natural.',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      tag: 'Kids',
      color: 'bg-blue-100 text-blue-700',
    },
    {
      title: 'Inglés General',
      description: 'Cursos para jóvenes y adultos de todos los niveles, enfoque comunicativo y práctico.',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      tag: 'Adultos',
      color: 'bg-green-100 text-green-700',
    },
    {
      title: 'Exámenes Cambridge',
      description: 'Preparación intensiva para First Certificate (FCE) y Proficiency (CPE) con alto éxito.',
      image: 'https://images.unsplash.com/photo-1546410531-bea5acadb6a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      tag: 'Internacional',
      color: 'bg-purple-100 text-purple-700',
    },
    {
      title: 'Taller de Conversación',
      description: 'Práctica intensiva para ganar fluidez y confianza al hablar en situaciones reales.',
      image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      tag: 'Práctico',
      color: 'bg-orange-100 text-orange-700',
    },
    {
      title: 'Ingreso a Profesorado',
      description: 'Preparación completa para el ingreso a carreras de profesorado y traductorado.',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      tag: 'Académico',
      color: 'bg-rose-100 text-rose-700',
    },
    {
      title: 'Inglés Corporativo',
      description: 'Programas in-company personalizados según las necesidades de cada organización.',
      image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      tag: 'Empresas',
      color: 'bg-slate-100 text-slate-700',
    },
  ];

  return (
    <section id="cursos" className="py-24">
      <div className="container">
        <div 
          ref={ref}
          className={cn('text-center mb-16 fade-in-up max-w-3xl mx-auto', isVisible && 'visible')}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
            Programas diseñados para <span className="text-primary">vos</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            No importa tu edad ni tu nivel actual. Tenemos el curso perfecto para que alcances tus metas con el inglés.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <motion.div
              key={course.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group cursor-pointer bg-card rounded-[2rem] overflow-hidden border shadow-sm card-hover flex flex-col h-full"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                <span className={cn("absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold shadow-sm", course.color)}>
                  {course.tag}
                </span>
              </div>

              <div className="p-8 flex-1 flex flex-col relative bg-card">
                {/* Floating Button that appears on hover */}
                <div className="absolute -top-6 right-6 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-300">
                  <ArrowRight className="w-6 h-6" />
                </div>

                <h3 className="text-2xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">{course.title}</h3>
                <p className="text-muted-foreground leading-relaxed flex-1">{course.description}</p>

                <div className="mt-6 pt-6 border-t flex items-center justify-between text-sm font-semibold text-primary">
                  <span>Saber más</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </div>
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
      bg: 'bg-green-100', text: 'text-green-600'
    },
    {
      icon: Award,
      title: 'Sin derecho de examen',
      description: 'Los exámenes internos no tienen costo adicional.',
      bg: 'bg-blue-100', text: 'text-blue-600'
    },
    {
      icon: Users,
      title: 'Grupos reducidos',
      description: 'Máximo 8 alumnos por grupo para una atención super personalizada.',
      bg: 'bg-purple-100', text: 'text-purple-600'
    },
    {
      icon: Globe,
      title: 'Recursos multimedios',
      description: 'Material digital, videos y recursos interactivos para un aprendizaje moderno.',
      bg: 'bg-orange-100', text: 'text-orange-600'
    },
  ];

  return (
    <section id="beneficios" className="py-24 bg-muted/50">
      <div className="container">
        <div className="grid lg:grid-cols-12 gap-12 items-center">

          <div className="lg:col-span-5" ref={ref}>
            <div className={cn('fade-in-up', isVisible && 'visible')}>
              <h2 className="text-4xl font-extrabold mb-6">
                Razones para elegirnos
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Nos enfocamos en eliminar barreras para que tu única preocupación sea aprender. Por eso te ofrecemos beneficios exclusivos únicos en el rubro.
              </p>

              <Button size="lg" className="rounded-xl btn-enhanced shadow-lg">
                Agendar Entrevista <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>

          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card p-8 rounded-3xl border shadow-sm card-hover hover:border-primary/50 relative overflow-hidden"
              >
                {/* Decorative background shape */}
                <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-50 ${benefit.bg}`} />

                <div className={`relative w-14 h-14 rounded-2xl ${benefit.bg} ${benefit.text} flex items-center justify-center mb-6`}>
                  <benefit.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </motion.div>
            ))}
          </div>

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
