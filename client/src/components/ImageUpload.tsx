import { useState, useCallback } from 'react';
import { Upload, X, ImageIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ImageUploadProps {
  onUploadSuccess: (url: string) => void;
  currentUrl?: string;
}

export function ImageUpload({ onUploadSuccess, currentUrl }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentUrl || null);

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecciona un archivo de imagen válido.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen es demasiado grande (máximo 5MB).');
      return;
    }

    setIsUploading(true);
    
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64 = reader.result as string;
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64, name: file.name }),
        });

        if (!response.ok) throw new Error('Error al subir');

        const data = await response.json();
        setPreview(data.url);
        onUploadSuccess(data.url);
        toast.success('Imagen subida correctamente');
      };
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('No se pudo subir la imagen.');
    } finally {
      setIsUploading(false);
    }
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  }, []);

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 flex flex-col items-center justify-center gap-4 cursor-pointer",
          isDragging ? "border-primary bg-primary/5 scale-[1.02]" : "border-muted-foreground/20 hover:border-primary/50 hover:bg-muted/50",
          preview && "p-2"
        )}
        onClick={() => !isUploading && document.getElementById('file-upload')?.click()}
      >
        <input
          id="file-upload"
          type="file"
          className="hidden"
          accept="image/*"
          onChange={onFileSelect}
          disabled={isUploading}
        />

        {isUploading ? (
          <div className="flex flex-col items-center gap-2 py-8">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-sm font-medium text-muted-foreground">Subiendo imagen...</p>
          </div>
        ) : preview ? (
          <div className="relative w-full aspect-video rounded-lg overflow-hidden group">
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <p className="text-white text-sm font-medium">Click para cambiar imagen</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setPreview(null);
                onUploadSuccess('');
              }}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Upload className="w-6 h-6 text-primary" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold">Haz clic o arrastra una imagen</p>
              <p className="text-xs text-muted-foreground mt-1">PNG, JPG o WEBP (máx. 5MB)</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
