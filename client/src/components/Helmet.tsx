import { useEffect } from 'react';

interface HelmetProps {
  title?: string;
  description?: string;
}

export function Helmet({ title, description }: HelmetProps) {
  useEffect(() => {
    if (title) {
      document.title = `${title} | NewSwindon`;
    }
    
    if (description) {
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', description);
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = description;
        document.head.appendChild(meta);
      }
    }
  }, [title, description]);

  return null;
}
