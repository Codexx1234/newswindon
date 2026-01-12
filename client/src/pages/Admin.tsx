import { useState, useEffect } from 'react';
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
  Image as ImageIcon,
  Settings as SettingsIcon,
  Calendar as CalendarIcon
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Navigation items for admin
const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/contacts', icon: MessageSquare, label: 'Contactos' },
  { href: '/admin/appointments', icon: Clock, label: 'Reservas' },
  { href: '/admin/testimonials', icon: Star, label: 'Testimonios' },
  { href: '/admin/chatbot', icon: HelpCircle, label: 'Chatbot FAQs' },
  { href: '/admin/gallery', icon: ImageIcon, label: 'Galería' },
  { href: '/admin/audit', icon: Users, label: 'Auditoría' },
  { href: '/admin/settings', icon: SettingsIcon, label: 'Ajustes' },
];

// Dashboard Overview
function DashboardOverview() {
  const { data: contacts } = trpc.contacts.list.useQuery();
  const { data: appointments } = trpc.appointments.list.useQuery();
  const { data: metrics } = trpc.metrics.getRecent.useQuery({ days: 7 });
  
  const stats = {
    total: contacts?.length || 0,
    nuevos: contacts?.filter(c => c.status === 'nuevo').length || 0,
    reservas: appointments?.length || 0,
    vistas: metrics?.reduce((acc, m) => acc + m.pageViews, 0) || 0,
  };

  const statCards = [
    { label: 'Total Contactos', value: stats.total, icon: Users, color: 'bg-blue-500' },
    { label: 'Nuevos Contactos', value: stats.nuevos, icon: MessageSquare, color: 'bg-yellow-500' },
    { label: 'Reservas Totales', value: stats.reservas, icon: Clock, color: 'bg-purple-500' },
    { label: 'Vistas (7d)', value: stats.vistas, icon: TrendingUp, color: 'bg-green-500' },
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
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Tendencia de Vistas (7 días)</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics || []}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1a6b6b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#1a6b6b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => new Date(date).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}
                  fontSize={12}
                />
                <YAxis fontSize={12} />
                <RechartsTooltip 
                  labelFormatter={(date) => new Date(date).toLocaleDateString('es-AR', { full: true } as any)}
                />
                <Area type="monotone" dataKey="pageViews" stroke="#1a6b6b" fillOpacity={1} fill="url(#colorViews)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Actividad de Contactos</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => new Date(date).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}
                  fontSize={12}
                />
                <YAxis fontSize={12} />
                <RechartsTooltip />
                <Line type="monotone" dataKey="contactSubmissions" name="Contactos" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="appointmentBookings" name="Reservas" stroke="#8b5cf6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>Gestiona el contenido de tu sitio</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="justify-start" asChild>
              <a href="/admin/contacts">
                <MessageSquare className="mr-2 h-4 w-4" />
                Contactos
              </a>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <a href="/admin/appointments">
                <Clock className="mr-2 h-4 w-4" />
                Reservas
              </a>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <a href="/admin/testimonials">
                <Star className="mr-2 h-4 w-4" />
                Testimonios
              </a>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <a href="/admin/gallery">
                <ImageIcon className="mr-2 h-4 w-4" />
                Galería
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
            <div className="flex justify-between">
              <p className="text-sm font-medium">Teléfono</p>
              <p className="text-sm text-muted-foreground">15 3070-7350</p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">swindoncollege2@gmail.com</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Contacts Management
function ContactsManagement() {
  const [filters, setFilters] = useState<{
    status?: "nuevo" | "contactado" | "en_proceso" | "cerrado" | "no_interesado";
    contactType?: "individual" | "empresa";
    search?: string;
  }>({});
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<any>(null);
  const [editFormData, setEditFormData] = useState<any>({});

  const { data: contacts, isLoading, refetch } = trpc.contacts.list.useQuery(filters);
  const updateStatusMutation = trpc.contacts.update.useMutation({
    onSuccess: () => {
      toast.success('Estado actualizado');
      refetch();
    },
  });
  const updateContactMutation = trpc.contacts.update.useMutation({
    onSuccess: () => {
      toast.success('Contacto actualizado');
      setIsEditDialogOpen(false);
      setEditingContact(null);
      refetch();
    },
    onError: (error) => {
      toast.error('Error al actualizar contacto');
    },
  });
  const deleteMutation = trpc.contacts.delete.useMutation({
    onSuccess: () => {
      toast.success('Contacto eliminado');
      refetch();
    },
  });

  const handleEditContact = (contact: any) => {
    setEditingContact(contact);
    setEditFormData({
      id: contact.id,
      fullName: contact.fullName,
      email: contact.email,
      phone: contact.phone || '',
      age: contact.age || '',
      currentLevel: contact.currentLevel || '',
      courseInterest: contact.courseInterest || '',
      message: contact.message || '',
      companyName: contact.companyName || '',
      employeeCount: contact.employeeCount || '',
      status: contact.status,
      notes: contact.notes || '',
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveContact = () => {
    updateContactMutation.mutate(editFormData);
  };

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input 
          placeholder="Buscar por nombre o email..." 
          value={filters.search || ''}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="bg-card"
        />
        <Select 
          value={filters.status || 'all'} 
          onValueChange={(v) => setFilters({ ...filters, status: v === 'all' ? undefined : v as any })}
        >
          <SelectTrigger className="bg-card">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="nuevo">Nuevo</SelectItem>
            <SelectItem value="contactado">Contactado</SelectItem>
            <SelectItem value="en_proceso">En proceso</SelectItem>
            <SelectItem value="cerrado">Cerrado</SelectItem>
          </SelectContent>
        </Select>
        <Select 
          value={filters.contactType || 'all'} 
          onValueChange={(v) => setFilters({ ...filters, contactType: v === 'all' ? undefined : v as any })}
        >
          <SelectTrigger className="bg-card">
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los tipos</SelectItem>
            <SelectItem value="individual">Individual</SelectItem>
            <SelectItem value="empresa">Empresa</SelectItem>
          </SelectContent>
        </Select>
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
                <TableHead>Origen</TableHead>
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
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-medium capitalize">{contact.source || 'Directo'}</span>
                        {contact.utmCampaign && (
                          <span className="text-[10px] text-muted-foreground">Camp: {contact.utmCampaign}</span>
                        )}
                      </div>
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
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditContact(contact)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
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
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Contact Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Contacto</DialogTitle>
            <DialogDescription>Modifica los datos del contacto</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Nombre</Label>
              <Input
                value={editFormData.fullName || ''}
                onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={editFormData.email || ''}
                onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
              />
            </div>
            <div>
              <Label>Teléfono</Label>
              <Input
                value={editFormData.phone || ''}
                onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
              />
            </div>
            <div>
              <Label>Edad</Label>
              <Input
                value={editFormData.age || ''}
                onChange={(e) => setEditFormData({ ...editFormData, age: e.target.value })}
              />
            </div>
            <div>
              <Label>Nivel Actual</Label>
              <Input
                value={editFormData.currentLevel || ''}
                onChange={(e) => setEditFormData({ ...editFormData, currentLevel: e.target.value })}
              />
            </div>
            <div>
              <Label>Interés de Curso</Label>
              <Input
                value={editFormData.courseInterest || ''}
                onChange={(e) => setEditFormData({ ...editFormData, courseInterest: e.target.value })}
              />
            </div>
            <div className="col-span-2">
              <Label>Mensaje</Label>
              <Textarea
                value={editFormData.message || ''}
                onChange={(e) => setEditFormData({ ...editFormData, message: e.target.value })}
              />
            </div>
            <div>
              <Label>Empresa</Label>
              <Input
                value={editFormData.companyName || ''}
                onChange={(e) => setEditFormData({ ...editFormData, companyName: e.target.value })}
              />
            </div>
            <div>
              <Label>Cantidad de Empleados</Label>
              <Input
                value={editFormData.employeeCount || ''}
                onChange={(e) => setEditFormData({ ...editFormData, employeeCount: e.target.value })}
              />
            </div>
            <div>
              <Label>Estado</Label>
              <Select
                value={editFormData.status}
                onValueChange={(v) => setEditFormData({ ...editFormData, status: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nuevo">Nuevo</SelectItem>
                  <SelectItem value="contactado">Contactado</SelectItem>
                  <SelectItem value="en_proceso">En proceso</SelectItem>
                  <SelectItem value="cerrado">Cerrado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Notas</Label>
              <Input
                value={editFormData.notes || ''}
                onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveContact} disabled={updateContactMutation.isPending}>
              {updateContactMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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

// Gallery Management
function GalleryManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<any>(null);
  const [formData, setFormData] = useState({
    url: '',
    caption: '',
    displayOrder: 0,
    isActive: true,
  });

  const { data: images, isLoading, refetch } = trpc.gallery.listAll.useQuery();
  const createMutation = trpc.gallery.create.useMutation({
    onSuccess: () => {
      toast.success('Imagen añadida');
      setIsDialogOpen(false);
      resetForm();
      refetch();
    },
  });
  const updateMutation = trpc.gallery.update.useMutation({
    onSuccess: () => {
      toast.success('Imagen actualizada');
      setIsDialogOpen(false);
      resetForm();
      refetch();
    },
  });
  const deleteMutation = trpc.gallery.delete.useMutation({
    onSuccess: () => {
      toast.success('Imagen eliminada');
      refetch();
    },
  });

  const resetForm = () => {
    setFormData({ url: '', caption: '', displayOrder: 0, isActive: true });
    setEditingImage(null);
  };

  const handleEdit = (image: any) => {
    setEditingImage(image);
    setFormData({
      url: image.url,
      caption: image.caption || '',
      displayOrder: image.displayOrder,
      isActive: image.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.url) {
      toast.error('La URL de la imagen es obligatoria');
      return;
    }
    if (editingImage) {
      updateMutation.mutate({ id: editingImage.id, ...formData });
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
          <h1 className="text-3xl font-bold">Galería</h1>
          <p className="text-muted-foreground">Gestiona las fotos que se muestran en el sitio</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Añadir Imagen
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingImage ? 'Editar' : 'Nueva'} Imagen</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="url">URL de la imagen</Label>
                <Input
                  id="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://ejemplo.com/foto.jpg"
                />
              </div>
              <div>
                <Label htmlFor="caption">Pie de foto (opcional)</Label>
                <Input
                  id="caption"
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  placeholder="Ej: Entrega de certificados 2023"
                />
              </div>
              <div>
                <Label htmlFor="order">Orden de visualización</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label>Activa</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending}>
                {editingImage ? 'Guardar' : 'Añadir'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images?.map((image) => (
          <Card key={image.id} className={cn(!image.isActive && 'opacity-50')}>
            <div className="aspect-video relative overflow-hidden rounded-t-xl">
              <img src={image.url} alt={image.caption || ''} className="object-cover w-full h-full" />
            </div>
            <CardContent className="p-3">
              <p className="text-sm font-medium truncate">{image.caption || 'Sin pie de foto'}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-muted-foreground">Orden: {image.displayOrder}</span>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(image)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => {
                    if (confirm('¿Eliminar imagen?')) deleteMutation.mutate({ id: image.id });
                  }}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Settings Management
function SettingsManagement() {
  const { data: adminEmail, refetch: refetchEmail } = trpc.settings.get.useQuery({ key: 'google_admin_email' });
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (adminEmail) setEmail(adminEmail);
  }, [adminEmail]);

  const setSettingMutation = trpc.settings.set.useMutation({
    onSuccess: () => {
      toast.success('Configuración guardada');
      refetchEmail();
    },
  });

  const handleSave = () => {
    if (!email || !email.includes('@')) {
      toast.error('Por favor ingresa un correo válido');
      return;
    }
    setSettingMutation.mutate({ key: 'google_admin_email', value: email });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Ajustes del Sistema</h1>
        <p className="text-muted-foreground">Configura las integraciones y parámetros globales</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-primary" />
            <CardTitle>Integración con Google Calendar</CardTitle>
          </div>
          <CardDescription>
            Define qué cuenta de Google recibirá las notificaciones y eventos de las reservas.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-email">Correo Administrativo de Google</Label>
            <Input 
              id="admin-email" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@gmail.com"
            />
            <p className="text-xs text-muted-foreground">
              Este es el correo donde se agendarán las entrevistas de nivelación.
            </p>
          </div>
          <Button onClick={handleSave} disabled={setSettingMutation.isPending}>
            {setSettingMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Guardar Configuración
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-muted/50 border-dashed">
        <CardHeader>
          <CardTitle className="text-sm">Estado de la API</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <span>Pendiente de configuración de credenciales en el servidor (.env)</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Audit Logs Management
function AuditLogsManagement() {
  const { data: logs, isLoading } = trpc.metrics.getAuditLogs.useQuery({ limit: 50 });

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
        <h1 className="text-3xl font-bold">Logs de Auditoría</h1>
        <p className="text-muted-foreground">Historial de acciones realizadas por administradores</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Acción</TableHead>
                <TableHead>Entidad</TableHead>
                <TableHead>Detalles</TableHead>
                <TableHead>IP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No hay logs registrados
                  </TableCell>
                </TableRow>
              ) : (
                logs?.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-xs">
                      {new Date(log.createdAt).toLocaleString('es-AR')}
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
                        {log.action}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs">
                      {log.entityType} ({log.entityId})
                    </TableCell>
                    <TableCell className="text-xs max-w-xs truncate">
                      {log.details}
                    </TableCell>
                    <TableCell className="text-xs">
                      {log.ipAddress}
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

// Appointments Management
function AppointmentsManagement() {
  const { data: appointments, isLoading, refetch } = trpc.appointments.list.useQuery();
  const updateStatusMutation = trpc.appointments.updateStatus.useMutation({
    onSuccess: () => {
      toast.success('Estado de reserva actualizado');
      refetch();
    },
  });

  const statusColors: Record<string, string> = {
    pendiente: 'bg-yellow-100 text-yellow-800',
    confirmada: 'bg-blue-100 text-blue-800',
    cancelada: 'bg-red-100 text-red-800',
    completada: 'bg-green-100 text-green-800',
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
        <h1 className="text-3xl font-bold">Reservas</h1>
        <p className="text-muted-foreground">Gestiona las entrevistas de nivelación y consultas agendadas</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Fecha y Hora</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No hay reservas registradas
                  </TableCell>
                </TableRow>
              ) : (
                appointments?.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell className="font-medium">{appointment.fullName}</TableCell>
                    <TableCell>
                      {new Date(appointment.appointmentDate).toLocaleString('es-AR')}
                    </TableCell>
                    <TableCell className="capitalize">
                      {appointment.appointmentType.replace('_', ' ')}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{appointment.email}</p>
                        <p className="text-muted-foreground">{appointment.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={appointment.status}
                        onValueChange={(value) => updateStatusMutation.mutate({ 
                          id: appointment.id, 
                          status: value as any 
                        })}
                      >
                        <SelectTrigger className={cn('w-32', statusColors[appointment.status])}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pendiente">Pendiente</SelectItem>
                          <SelectItem value="confirmada">Confirmada</SelectItem>
                          <SelectItem value="cancelada">Cancelada</SelectItem>
                          <SelectItem value="completada">Completada</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right flex gap-2 justify-end">
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        disabled={appointment.status === 'cancelada' || updateStatusMutation.isPending}
                        onClick={() => {
                          if (confirm('¿Estás seguro de cancelar esta cita? Se enviará un correo de notificación al usuario.')) {
                            updateStatusMutation.mutate({ id: appointment.id, status: 'cancelada' });
                          }
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <a 
                          href={`https://wa.me/${appointment.phone.replace(/\D/g, '')}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          WhatsApp
                        </a>
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
    if (path === '/admin/appointments') return <AppointmentsManagement />;
    if (path === '/admin/testimonials') return <TestimonialsManagement />;
    if (path === '/admin/chatbot') return <ChatbotManagement />;
    if (path === '/admin/audit') return <AuditLogsManagement />;
    if (path === '/admin/gallery') return <GalleryManagement />;
    if (path === '/admin/settings') return <SettingsManagement />;
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
