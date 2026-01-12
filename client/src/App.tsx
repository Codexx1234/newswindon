import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Empresas from "./pages/Empresas";
import Admin from "./pages/Admin";
import { Navbar } from "./components/Navbar";
import { useEffect } from "react";
import { trpc } from "./lib/trpc";
import { Footer } from "./components/Footer";
import { WhatsAppButton } from "./components/WhatsAppButton";
import { ScrollToTop } from "./components/ScrollToTop";
import { ReadingProgress } from "./components/ReadingProgress";
import { Chatbot } from "./components/Chatbot";

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <ReadingProgress />
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
      <Chatbot />
      <ScrollToTop />
    </div>
  );
}

function Router() {
  const trackPageView = trpc.metrics.trackPageView.useMutation();

  useEffect(() => {
    trackPageView.mutate();
  }, []);

  return (
    <Switch>
      <Route path="/">
        <PublicLayout>
          <Home />
        </PublicLayout>
      </Route>
      <Route path="/empresas">
        <PublicLayout>
          <Empresas />
        </PublicLayout>
      </Route>
      <Route path="/admin">
        <Admin />
      </Route>
      <Route path="/admin/:rest*">
        <Admin />
      </Route>
      <Route path="/404">
        <PublicLayout>
          <NotFound />
        </PublicLayout>
      </Route>
      <Route>
        <PublicLayout>
          <NotFound />
        </PublicLayout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
