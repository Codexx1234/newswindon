import { trpc } from '@/lib/trpc';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export function GallerySection() {
  const { data: images, isLoading } = trpc.gallery.listActive.useQuery();
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>();

  if (isLoading || !images || images.length === 0) return null;

  return (
    <section id="galeria" className="py-20">
      <div className="container">
        <div 
          ref={ref}
          className={cn('text-center mb-12 fade-in-up', isVisible && 'visible')}
        >
          <span className="badge-primary mb-4">Nuestra Academia</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-4">
            Momentos en NewSwindon
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Conocé nuestras instalaciones y las actividades que realizamos con nuestros alumnos.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative aspect-video overflow-hidden rounded-2xl shadow-md"
            >
              <img 
                src={image.url} 
                alt={image.caption || 'Foto de NewSwindon'} 
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
              />
              {image.caption && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <p className="text-white text-sm font-medium">{image.caption}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
