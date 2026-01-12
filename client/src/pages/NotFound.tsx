import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Home, MessageCircle } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

export default function NotFound() {
  const [, setLocation] = useLocation();
  const { data: phone } = trpc.settings.get.useQuery({ key: 'site_phone' });
  const displayPhone = phone || '15 3070-7350';
  const whatsappPhone = displayPhone.replace(/\s/g, '').replace(/^\+/, '');
  const finalWhatsappPhone = whatsappPhone.startsWith('54') ? whatsappPhone : `549${whatsappPhone}`;

  const handleGoHome = () => {
    setLocation("/");
  };

  return (
    <div className="min-h-[70vh] w-full flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-2xl border-none bg-card/50 backdrop-blur-md overflow-hidden">
        <div className="h-2 bg-primary w-full" />
        <CardContent className="pt-12 pb-12 text-center">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping" />
              <div className="relative bg-primary/10 p-6 rounded-full">
                <AlertCircle className="h-12 w-12 text-primary" />
              </div>
            </div>
          </div>

          <h1 className="text-6xl font-black text-primary mb-2">404</h1>

          <h2 className="text-2xl font-bold text-foreground mb-4">
            ¡Ups! Página no encontrada
          </h2>

          <p className="text-muted-foreground mb-10 leading-relaxed max-w-sm mx-auto">
            Parece que la página que buscás no existe o fue movida. 
            No te preocupes, podés volver al inicio o consultarnos por WhatsApp.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleGoHome}
              size="lg"
              className="rounded-xl px-8 shadow-lg hover:shadow-primary/20 transition-all"
            >
              <Home className="w-4 h-4 mr-2" />
              Volver al Inicio
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="rounded-xl px-8 border-primary/20 hover:bg-primary/5"
            >
              <a 
                href={`https://wa.me/${finalWhatsappPhone}?text=Hola!%20Me%20perdí%20en%20la%20web%20y%20necesito%20ayuda.`} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-4 h-4 mr-2 text-[#25D366]" />
                Consultar WhatsApp
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
