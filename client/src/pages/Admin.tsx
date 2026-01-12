import { useState } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { getLoginUrl } from '@/const';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  LayoutDashboard,
  MessageSquare,
  Star,
  HelpCircle,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  LogIn,
} from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Navigation items for admin
const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/contacts', icon: MessageSquare, label: 'Contactos' },
  { href: '/admin/testimonials', icon: Star, label: 'Testimonios' },
  { href: '/admin/chatbot', icon: HelpCircle, label: 'Chatbot FAQs' },
];

// Dashboard Overview
function DashboardOverview() {
  const { data: contacts } = trpc.contacts.list.useQuery();
  
  const stats = {
    total: contacts?.length || 0,
    nuevos: contacts?.filter(c => c.status === 'nuevo').length || 0,
    empresas: contacts?.filter(c => c.contactType === 'empresa').length || 0,
  };

  const statCards = [
    { label: 'Total Contactos', value: stats.total, icon: Users, color: 'bg-blue-500' },
    { label: 'Nuevos', value: stats.nuevos, icon: Clock, color: 'bg-yellow-500' },
    { label: 'Empresas', value: stats.empresas, icon: TrendingUp, color: 'bg-green-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Bienvenido al panel de administración de NewSwindon</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <div className={cn('p-2 rounded-lg', stat.color)}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>Gestiona el contenido de tu sitio</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="/admin/contacts">
                <MessageSquare className="mr-2 h-4 w-4" />
                Ver contactos recientes
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="/admin/testimonials">
                <Star className="mr-2 h-4 w-4" />
                Gestionar testimonios
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="/admin/chatbot">
                <HelpCircle className="mr-2 h-4 w-4" />
                Configurar chatbot
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Información del Sitio</CardTitle>
            <CardDescription>Datos de contacto configurados</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium">Teléfono</p>
              <p className="text-sm text-muted-foreground">15 3070-7350</p>
            </div>
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">swindoncollege2@gmail.com</p>
            </div>
            <div>
              <p className="text-sm font-medium">Ubicación</p>
              <p className="text-sm text-muted-foreground">Carapachay, Buenos Aires</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Contacts Management
function ContactsManagement() {
  const { data: contacts, isLoading, refetch } = trpc.contacts.list.useQuery();
  const updateStatusMutation = trpc.contacts.update.useMutation({
    onSuccess: () => {
      toast.success('Estado actualizado');
      refetch();
    },
  });
  const deleteMutation = trpc.contacts.delete.useMutation({
    onSuccess: () => {
      toast.success('Contacto eliminado');
      refetch();
    },
  });

  const statusColors: Record<string, string> = {
    nuevo: 'bg-yellow-100 text-yellow-800',
    contactado: 'bg-blue-100 text-blue-800',
    en_proceso: 'bg-purple-100 text-purple-800',
    cerrado: 'bg-green-100 text-green-800',
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Contactos</h1>
        <p className="text-muted-foreground">Gestiona los mensajes recibidos del formulario de contacto</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No hay contactos registrados
                  </TableCell>
                </TableRow>
              ) : (
                contacts?.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell className="font-medium">{contact.fullName}</TableCell>
                    <TableCell>{contact.email}</TableCell>
                    <TableCell>{contact.phone || '-'}</TableCell>
                    <TableCell>
                      <span className={cn(
                        'px-2 py-1 rounded-full text-xs',
                        contact.contactType === 'empresa' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                      )}>
                        {contact.contactType === 'empresa' ? 'Empresa' : 'Individual'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={contact.status}
                        onValueChange={(value) => updateStatusMutation.mutate({ 
                          id: contact.id, 
                          status: value as any 
                        })}
                      >
                        <SelectTrigger className={cn('w-32', statusColors[contact.status])}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="nuevo">Nuevo</SelectItem>
                          <SelectItem value="contactado">Contactado</SelectItem>
                          <SelectItem value="en_proceso">En proceso</SelectItem>
                          <SelectItem value="cerrado">Cerrado</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {new Date(contact.createdAt).toLocaleDateString('es-AR')}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          if (confirm('¿Eliminar este contacto?')) {
                            deleteMutation.mutate({ id: contact.id });
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// Testimonials Management
function TestimonialsManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<any>(null);
  const [formData, setFormData] = useState({
    authorName: '',
    authorRole: '',
    content: '',
    rating: 5,
    isActive: true,
  });

  const { data: testimonials, isLoading, refetch } = trpc.testimonials.listAll.useQuery();
  const createMutation = trpc.testimonials.create.useMutation({
    onSuccess: () => {
      toast.success('Testimonio creado');
      setIsDialogOpen(false);
      resetForm();
      refetch();
    },
  });
  const updateMutation = trpc.testimonials.update.useMutation({
    onSuccess: () => {
      toast.success('Testimonio actualizado');
      setIsDialogOpen(false);
      resetForm();
      refetch();
    },
  });
  const deleteMutation = trpc.testimonials.delete.useMutation({
    onSuccess: () => {
      toast.success('Testimonio eliminado');
      refetch();
    },
  });

  const resetForm = () => {
    setFormData({ authorName: '', authorRole: '', content: '', rating: 5, isActive: true });
    setEditingTestimonial(null);
  };

  const handleEdit = (testimonial: any) => {
    setEditingTestimonial(testimonial);
    setFormData({
      authorName: testimonial.authorName,
      authorRole: testimonial.authorRole || '',
      content: testimonial.content,
      rating: testimonial.rating || 5,
      isActive: testimonial.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.authorName || !formData.content) {
      toast.error('Por favor completa los campos obligatorios');
      return;
    }
    if (editingTestimonial) {
      updateMutation.mutate({ id: editingTestimonial.id, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Testimonios</h1>
          <p className="text-muted-foreground">Gestiona los testimonios que se muestran en el sitio</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Agregar testimonio
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingTestimonial ? 'Editar' : 'Nuevo'} Testimonio</DialogTitle>
              <DialogDescription>
                {editingTestimonial ? 'Modifica los datos del testimonio' : 'Agrega un nuevo testimonio al sitio'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="authorName">Nombre del autor</Label>
                <Input
                  id="authorName"
                  value={formData.authorName}
                  onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                  placeholder="Ej: María González"
                />
              </div>
              <div>
                <Label htmlFor="authorRole">Rol (opcional)</Label>
                <Input
                  id="authorRole"
                  value={formData.authorRole}
                  onChange={(e) => setFormData({ ...formData, authorRole: e.target.value })}
                  placeholder="Ej: Mamá de Sofía (8 años)"
                />
              </div>
              <div>
                <Label htmlFor="content">Testimonio</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Escribe el testimonio..."
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="rating">Calificación (1-5)</Label>
                <Select
                  value={formData.rating.toString()}
                  onValueChange={(value) => setFormData({ ...formData, rating: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <SelectItem key={n} value={n.toString()}>{n} estrellas</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label>Activo (visible en el sitio)</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending}>
                {(createMutation.isPending || updateMutation.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {editingTestimonial ? 'Guardar cambios' : 'Crear testimonio'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {testimonials?.length === 0 ? (
          <Card className="col-span-2">
            <CardContent className="py-8 text-center text-muted-foreground">
              No hay testimonios registrados. Agrega el primero.
            </CardContent>
          </Card>
        ) : (
          testimonials?.map((testimonial) => (
            <Card key={testimonial.id} className={cn(!testimonial.isActive && 'opacity-60')}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{testimonial.authorName}</CardTitle>
                    {testimonial.authorRole && (
                      <CardDescription>{testimonial.authorRole}</CardDescription>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(testimonial)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (confirm('¿Eliminar este testimonio?')) {
                          deleteMutation.mutate({ id: testimonial.id });
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">"{testimonial.content}"</p>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          'h-4 w-4',
                          i < (testimonial.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                        )}
                      />
                    ))}
                  </div>
                  <span className={cn(
                    'text-xs px-2 py-0.5 rounded-full',
                    testimonial.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  )}>
                    {testimonial.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

// Chatbot FAQs Management
function ChatbotManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<any>(null);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: '',
    isActive: true,
  });

  const { data: faqs, isLoading, refetch } = trpc.chatbot.listAll.useQuery();
  const createMutation = trpc.chatbot.createFaq.useMutation({
    onSuccess: () => {
      toast.success('FAQ creada');
      setIsDialogOpen(false);
      resetForm();
      refetch();
    },
  });
  const updateMutation = trpc.chatbot.updateFaq.useMutation({
    onSuccess: () => {
      toast.success('FAQ actualizada');
      setIsDialogOpen(false);
      resetForm();
      refetch();
    },
  });
  const deleteMutation = trpc.chatbot.deleteFaq.useMutation({
    onSuccess: () => {
      toast.success('FAQ eliminada');
      refetch();
    },
  });

  const resetForm = () => {
    setFormData({ question: '', answer: '', category: '', isActive: true });
    setEditingFaq(null);
  };

  const handleEdit = (faq: any) => {
    setEditingFaq(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category || '',
      isActive: faq.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.question || !formData.answer) {
      toast.error('Por favor completa los campos obligatorios');
      return;
    }
    if (editingFaq) {
      updateMutation.mutate({ id: editingFaq.id, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Chatbot FAQs</h1>
          <p className="text-muted-foreground">Configura las preguntas frecuentes del chatbot</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Agregar FAQ
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingFaq ? 'Editar' : 'Nueva'} FAQ</DialogTitle>
              <DialogDescription>
                {editingFaq ? 'Modifica la pregunta frecuente' : 'Agrega una nueva pregunta frecuente'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="question">Pregunta</Label>
                <Input
                  id="question"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="Ej: ¿Cuáles son los horarios de clase?"
                />
              </div>
              <div>
                <Label htmlFor="answer">Respuesta</Label>
                <Textarea
                  id="answer"
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  placeholder="Escribe la respuesta..."
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="category">Categoría (opcional)</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cursos">Cursos</SelectItem>
                    <SelectItem value="horarios">Horarios</SelectItem>
                    <SelectItem value="precios">Precios</SelectItem>
                    <SelectItem value="examenes">Exámenes</SelectItem>
                    <SelectItem value="empresas">Empresas</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label>Activa (usada por el chatbot)</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending}>
                {(createMutation.isPending || updateMutation.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {editingFaq ? 'Guardar cambios' : 'Crear FAQ'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pregunta</TableHead>
                <TableHead>Respuesta</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {faqs?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No hay FAQs configuradas. Agrega la primera.
                  </TableCell>
                </TableRow>
              ) : (
                faqs?.map((faq) => (
                  <TableRow key={faq.id} className={cn(!faq.isActive && 'opacity-60')}>
                    <TableCell className="font-medium max-w-[200px] truncate">{faq.question}</TableCell>
                    <TableCell className="max-w-[300px] truncate">{faq.answer}</TableCell>
                    <TableCell>
                      {faq.category && (
                        <span className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                          {faq.category}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className={cn(
                        'px-2 py-1 rounded-full text-xs',
                        faq.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      )}>
                        {faq.isActive ? 'Activa' : 'Inactiva'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(faq)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          if (confirm('¿Eliminar esta FAQ?')) {
                            deleteMutation.mutate({ id: faq.id });
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// Admin Sidebar Component
function AdminSidebar({ currentPath }: { currentPath: string }) {
  const { user, logout } = useAuth();

  return (
    <div className="w-64 bg-card border-r min-h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">N</span>
          </div>
          <div>
            <h2 className="font-semibold">NewSwindon</h2>
            <p className="text-xs text-muted-foreground">Panel Admin</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  currentPath === item.href
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-medium text-primary">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="w-full" onClick={logout}>
          <LogIn className="w-4 h-4 mr-2" />
          Cerrar sesión
        </Button>
        <Button variant="ghost" size="sm" className="w-full mt-2" asChild>
          <a href="/">Volver al sitio</a>
        </Button>
      </div>
    </div>
  );
}

// Main Admin Page
export default function Admin() {
  const { user, loading, isAuthenticated } = useAuth();
  const path = typeof window !== 'undefined' ? window.location.pathname : '/admin';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
              <span className="text-primary-foreground font-bold text-2xl">N</span>
            </div>
            <CardTitle>Panel de Administración</CardTitle>
            <CardDescription>Inicia sesión para acceder al panel de NewSwindon</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <a href={getLoginUrl()}>
                <LogIn className="mr-2 h-4 w-4" />
                Iniciar sesión
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Acceso Denegado</CardTitle>
            <CardDescription>No tenés permisos para acceder a esta sección</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <a href="/">Volver al inicio</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderContent = () => {
    if (path === '/admin/contacts') return <ContactsManagement />;
    if (path === '/admin/testimonials') return <TestimonialsManagement />;
    if (path === '/admin/chatbot') return <ChatbotManagement />;
    return <DashboardOverview />;
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar currentPath={path} />
      <main className="flex-1 p-6 overflow-auto">
        {renderContent()}
      </main>
    </div>
  );
}
