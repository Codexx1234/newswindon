import { ArrowUp } from 'lucide-react';
import { useScrollToTop } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';

export function ScrollToTop() {
  const { isVisible, scrollToTop } = useScrollToTop();

  return (
    <button
      onClick={scrollToTop}
      className={cn('scroll-top-btn', isVisible && 'visible')}
      aria-label="Volver arriba"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
}
