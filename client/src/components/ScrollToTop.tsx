import { ArrowUp } from 'lucide-react';
import { useScrollToTop } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';

export function ScrollToTop() {
  const { isVisible, scrollToTop } = useScrollToTop();

  return (
    <button
      onClick={scrollToTop}
      className={cn(
        'fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 opacity-0 invisible',
        isVisible && 'opacity-100 visible'
      )}
      aria-label="Volver arriba"
    >
      <ArrowUp className="w-6 h-6" />
    </button>
  );
}
