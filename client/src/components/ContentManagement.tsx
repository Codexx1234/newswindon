import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Pencil, RotateCcw, Loader2 } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

interface ContentBlock {
  id: number;
  key: string;
  page: string;
  section: string;
  label: string;
  defaultValue: string;
  value: string | null;
  updatedAt: Date;
}

export default function ContentManagement() {
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: allBlocks, isLoading } = trpc.content.getAll.useQuery();
  const updateMutation = trpc.content.update.useMutation({
    onSuccess: () => {
      toast.success('Contenido actualizado');
      setIsDialogOpen(false);
      setEditingKey(null);
    },
    onError: (err) => {
      toast.error(err.message || 'Error al actualizar');
    },
  });

  const resetMutation = trpc.content.reset.useMutation({
    onSuccess: () => {
      toast.success('Contenido reseteado al valor por defecto');
    },
    onError: (err) => {
      toast.error(err.message || 'Error al resetear');
    },
  });

  useEffect(() => {
    if (allBlocks) {
      setBlocks(allBlocks as ContentBlock[]);
    }
  }, [allBlocks]);

  const handleEdit = (block: ContentBlock) => {
    setEditingKey(block.key);
    setEditValue(block.value || block.defaultValue);
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!editingKey) return;
    updateMutation.mutate({ key: editingKey, value: editValue });
  };

  const handleReset = (key: string) => {
    if (confirm('¿Estás seguro de que querés resetear este contenido al valor por defecto?')) {
      resetMutation.mutate({ key });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const groupedByPage = blocks.reduce((acc, block) => {
    if (!acc[block.page]) acc[block.page] = [];
    acc[block.page].push(block);
    return acc;
  }, {} as Record<string, ContentBlock[]>);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edición de Contenidos</h1>
        <p className="text-muted-foreground mt-2">
          Edita los textos de tu sitio web. Los cambios se mostrarán inmediatamente.
        </p>
      </div>

      {Object.entries(groupedByPage).map(([page, pageBlocks]) => (
        <Card key={page}>
          <CardHeader>
            <CardTitle className="capitalize">{page}</CardTitle>
            <CardDescription>{pageBlocks.length} elementos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sección</TableHead>
                    <TableHead>Etiqueta</TableHead>
                    <TableHead>Valor Actual</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageBlocks.map((block) => (
                    <TableRow key={block.key}>
                      <TableCell className="capitalize">{block.section}</TableCell>
                      <TableCell>{block.label}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {block.value || block.defaultValue}
                      </TableCell>
                      <TableCell>
                        {block.value ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Editado
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Por defecto
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Dialog open={isDialogOpen && editingKey === block.key} onOpenChange={setIsDialogOpen}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(block)}
                            >
                              <Pencil className="h-4 w-4 mr-1" />
                              Editar
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Editar: {block.label}</DialogTitle>
                              <DialogDescription>
                                Página: <strong className="capitalize">{block.page}</strong> | Sección: <strong className="capitalize">{block.section}</strong>
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label>Valor por defecto</Label>
                                <div className="mt-1 p-3 bg-muted rounded text-sm text-muted-foreground">
                                  {block.defaultValue}
                                </div>
                              </div>
                              <div>
                                <Label htmlFor="edit-value">Nuevo valor</Label>
                                <Textarea
                                  id="edit-value"
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  rows={6}
                                  placeholder="Ingresa el nuevo valor..."
                                />
                              </div>
                            </div>
                            <DialogFooter className="flex gap-2">
                              {block.value && (
                                <Button
                                  variant="outline"
                                  onClick={() => handleReset(block.key)}
                                  disabled={resetMutation.isPending}
                                >
                                  <RotateCcw className="h-4 w-4 mr-1" />
                                  Resetear
                                </Button>
                              )}
                              <Button
                                onClick={handleSave}
                                disabled={updateMutation.isPending}
                              >
                                {updateMutation.isPending ? (
                                  <>
                                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                    Guardando...
                                  </>
                                ) : (
                                  'Guardar'
                                )}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        {block.value && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleReset(block.key)}
                            disabled={resetMutation.isPending}
                            title="Resetear al valor por defecto"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ))}

      {blocks.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            No hay contenidos disponibles para editar
          </CardContent>
        </Card>
      )}
    </div>
  );
}
