import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const contactSchema = z.object({
  fullName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Ingresá un email válido'),
  phone: z.string().optional(),
  age: z.string().optional(),
  currentLevel: z.string().optional(),
  courseInterest: z.string().optional(),
  message: z.string().optional(),
  companyName: z.string().optional(),
  employeeCount: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface ContactFormProps {
  contactType?: 'individual' | 'empresa';
  showCompanyField?: boolean;
}

export function ContactForm({ contactType = 'individual', showCompanyField = false }: ContactFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { ref, isVisible } = useScrollAnimation<HTMLFormElement>();
  
  const submitMutation = trpc.contacts.submit.useMutation({
    onSuccess: () => {
      setIsSubmitted(true);
      toast.success('¡Mensaje enviado!', {
        description: 'Te contactaremos a la brevedad.',
      });
    },
    onError: (error) => {
      toast.error('Error al enviar', {
        description: error.message || 'Por favor, intentá de nuevo.',
      });
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = (data: ContactFormData) => {
    submitMutation.mutate({
      ...data,
      contactType,
    });
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-12 px-6 bg-card rounded-2xl border shadow-lg">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold mb-2">¡Gracias por contactarnos!</h3>
        <p className="text-muted-foreground mb-6">
          Recibimos tu mensaje correctamente. Te enviaremos un email de confirmación 
          y nos pondremos en contacto a la brevedad.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-[#25D366] hover:bg-[#128C7E] text-white">
            <a 
              href="https://wa.me/5491130707350?text=Hola!%20Acabo%20de%20enviar%20un%20formulario%20en%20la%20web%20y%20me%20gustaría%20más%20información." 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Contactar por WhatsApp
            </a>
          </Button>
          <Button onClick={() => setIsSubmitted(false)} variant="outline">
            Enviar otro mensaje
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      ref={ref}
      onSubmit={handleSubmit(onSubmit)}
      className={cn(
        'bg-card rounded-2xl border shadow-lg p-6 md:p-8 space-y-6 fade-in-up',
        isVisible && 'visible'
      )}
    >
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2">
          {contactType === 'empresa' ? 'Solicitar información para empresas' : 'Quiero estudiar inglés'}
        </h3>
        <p className="text-muted-foreground">
          Completá el formulario y te contactaremos a la brevedad
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="fullName">Nombre completo *</Label>
          <Input
            id="fullName"
            placeholder="Tu nombre"
            {...register('fullName')}
            className={cn('input-focus', errors.fullName && 'border-destructive')}
          />
          {errors.fullName && (
            <p className="text-sm text-destructive">{errors.fullName.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            placeholder="tu@email.com"
            {...register('email')}
            className={cn('input-focus', errors.email && 'border-destructive')}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone">Teléfono</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="Tu teléfono"
            {...register('phone')}
            className="input-focus"
          />
        </div>

        {/* Company Name */}
        {contactType === 'empresa' && (
          <div className="space-y-2">
            <Label htmlFor="companyName">Nombre de la empresa</Label>
            <Input
              id="companyName"
              placeholder="Tu empresa"
              {...register('companyName')}
              className="input-focus"
            />
          </div>
        )}

        {/* Employee Count */}
        {contactType === 'empresa' && (
          <div className="space-y-2">
            <Label htmlFor="employeeCount">Cantidad de empleados a capacitar</Label>
            <Select onValueChange={(value) => setValue('employeeCount', value)}>
              <SelectTrigger className="input-focus">
                <SelectValue placeholder="Seleccioná una opción" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-5">1 a 5 empleados</SelectItem>
                <SelectItem value="6-20">6 a 20 empleados</SelectItem>
                <SelectItem value="21-50">21 a 50 empleados</SelectItem>
                <SelectItem value="+50">Más de 50 empleados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Age */}
        {contactType === 'individual' && (
          <div className="space-y-2">
            <Label htmlFor="age">Edad del estudiante</Label>
            <Select onValueChange={(value) => setValue('age', value)}>
              <SelectTrigger className="input-focus">
                <SelectValue placeholder="Seleccioná una opción" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3-5">3 a 5 años</SelectItem>
                <SelectItem value="6-10">6 a 10 años</SelectItem>
                <SelectItem value="11-15">11 a 15 años</SelectItem>
                <SelectItem value="16-18">16 a 18 años</SelectItem>
                <SelectItem value="adulto">Adulto (+18)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Current Level */}
        <div className="space-y-2">
          <Label htmlFor="currentLevel">Nivel actual de inglés</Label>
          <Select onValueChange={(value) => setValue('currentLevel', value)}>
            <SelectTrigger className="input-focus">
              <SelectValue placeholder="Seleccioná tu nivel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ninguno">Sin conocimientos</SelectItem>
              <SelectItem value="basico">Básico</SelectItem>
              <SelectItem value="intermedio">Intermedio</SelectItem>
              <SelectItem value="avanzado">Avanzado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Course Interest */}
        <div className="space-y-2">
          <Label htmlFor="courseInterest">¿Qué te interesa?</Label>
          <Select onValueChange={(value) => setValue('courseInterest', value)}>
            <SelectTrigger className="input-focus">
              <SelectValue placeholder="Seleccioná una opción" />
            </SelectTrigger>
            <SelectContent>
              {contactType === 'individual' ? (
                <>
                  <SelectItem value="general">Inglés general</SelectItem>
                  <SelectItem value="ninos">Inglés para niños</SelectItem>
                  <SelectItem value="cambridge">Preparación Cambridge</SelectItem>
                  <SelectItem value="conversacion">Taller de conversación</SelectItem>
                  <SelectItem value="profesorado">Ingreso a profesorado</SelectItem>
                </>
              ) : (
                <>
                  <SelectItem value="corporativo">Capacitación corporativa general</SelectItem>
                  <SelectItem value="tecnico">Inglés técnico especializado</SelectItem>
                  <SelectItem value="negocios">Inglés de negocios (Business English)</SelectItem>
                  <SelectItem value="conversacion_corp">Talleres de conversación para empleados</SelectItem>
                  <SelectItem value="evaluaciones">Evaluaciones de nivel para personal</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Message */}
      <div className="space-y-2">
        <Label htmlFor="message">Mensaje (opcional)</Label>
        <Textarea
          id="message"
          placeholder="Contanos más sobre lo que buscás..."
          rows={4}
          {...register('message')}
          className="input-focus resize-none"
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        size="lg"
        className="w-full btn-shine"
        disabled={submitMutation.isPending}
      >
        {submitMutation.isPending ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Enviando...
          </>
        ) : (
          <>
            <Send className="w-4 h-4 mr-2" />
            Enviar mensaje
          </>
        )}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        Al enviar este formulario, aceptás que nos pongamos en contacto con vos 
        para brindarte información sobre nuestros cursos.
      </p>
    </form>
  );
}
