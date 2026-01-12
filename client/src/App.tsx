import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { lazy, Suspense } from "react";
const Home = lazy(() => import("./pages/Home"));
const Empresas = lazy(() => import("./pages/Empresas"));
const Admin = lazy(() => import("./pages/Admin"));
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
        <Suspense fallback={
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        }>
          {children}
        </Suspense>
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
