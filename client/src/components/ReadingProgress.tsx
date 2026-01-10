import { useReadingProgress } from '@/hooks/useScrollAnimation';

export function ReadingProgress() {
  const progress = useReadingProgress();

  return (
    <div 
      className="reading-progress"
      style={{ width: `${progress}%` }}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Progreso de lectura"
    />
  );
}
