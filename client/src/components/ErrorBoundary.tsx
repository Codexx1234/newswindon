import { cn } from "@/lib/utils";
import { AlertTriangle, RotateCcw, MessageCircle } from "lucide-react";
import { Component, ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen p-6 bg-gradient-to-br from-background to-muted/30">
          <div className="flex flex-col items-center w-full max-w-md text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <AlertTriangle size={40} className="text-primary" />
            </div>

            <h2 className="text-3xl font-bold mb-4">Algo no salió como esperábamos</h2>
            
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Estamos teniendo un inconveniente técnico momentáneo. 
              No te preocupes, tu información está segura. Podés intentar recargar la página 
              o contactarnos directamente por WhatsApp.
            </p>

            <div className="flex flex-col w-full gap-3">
              <Button 
                onClick={() => window.location.reload()}
                size="lg"
                className="rounded-xl shadow-lg"
              >
                <RotateCcw size={18} className="mr-2" />
                Recargar Página
              </Button>
              
              <Button 
                variant="outline"
                size="lg"
                className="rounded-xl border-primary/20"
                asChild
              >
                <a 
                  href="https://wa.me/5491130707350?text=Hola!%20Tengo%20un%20problema%20con%20la%20web%20de%20NewSwindon." 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <MessageCircle size={18} className="mr-2 text-[#25D366]" />
                  Hablar con un Coordinador
                </a>
              </Button>
            </div>

            {process.env.NODE_ENV === 'development' && (
              <div className="mt-12 p-4 w-full rounded-xl bg-muted/50 text-left overflow-auto border border-dashed">
                <p className="text-xs font-mono text-muted-foreground uppercase mb-2 tracking-widest">Debug Info:</p>
                <pre className="text-[10px] text-muted-foreground whitespace-break-spaces font-mono">
                  {this.state.error?.message}
                </pre>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
