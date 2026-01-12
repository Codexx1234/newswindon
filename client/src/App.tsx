import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { lazy, Suspense } from "react";
import { AnimatePresence } from "framer-motion";
import { PageTransition } from "./components/PageTransition";
import Home from "./pages/Home";
const Empresas = lazy(() => import("./pages/Empresas"));
const Admin = lazy(() => import("./pages/Admin"));
import { Navbar } from "./components/Navbar";
import { useEffect, useState } from "react";
import { trpc } from "./lib/trpc";
import { Footer } from "./components/Footer";
import { WhatsAppButton } from "./components/WhatsAppButton";
import { ScrollToTop } from "./components/ScrollToTop";
import { ReadingProgress } from "./components/ReadingProgress";
import { Chatbot } from "./components/Chatbot";
import { ThemeTransition } from "./components/ThemeTransition";

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
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    trackPageView.mutate();
  }, []);

  useEffect(() => {
    // Mark that initial load is complete after first render
    setIsInitialLoad(false);
  }, []);

  return (
    <AnimatePresence mode="wait">
      <Switch>
        <Route path="/">
          <PageTransition key="home" skipInitialAnimation={isInitialLoad}>
            <PublicLayout>
              <Home />
            </PublicLayout>
          </PageTransition>
        </Route>
        <Route path="/empresas">
          <PageTransition key="empresas">
            <PublicLayout>
              <Empresas />
            </PublicLayout>
          </PageTransition>
        </Route>
        <Route path="/admin">
          <PageTransition key="admin">
            <Admin />
          </PageTransition>
        </Route>
        <Route path="/admin/:rest*">
          <PageTransition key="admin-rest">
            <Admin />
          </PageTransition>
        </Route>
        <Route path="/404">
          <PageTransition key="404">
            <PublicLayout>
              <NotFound />
            </PublicLayout>
          </PageTransition>
        </Route>
        <Route>
          <PageTransition key="not-found">
            <PublicLayout>
              <NotFound />
            </PublicLayout>
          </PageTransition>
        </Route>
      </Switch>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <ThemeTransition />
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
