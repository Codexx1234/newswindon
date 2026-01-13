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
  MessageCircle,
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

function SiteInfoDisplay() {
  const { data: phone } = trpc.settings.get.useQuery({ key: 'site_phone' });
  const { data: email } = trpc.settings.get.useQuery({ key: 'site_email' });

  return (
    <>
      <div className="flex justify-between">
        <p className="text-sm font-medium">Teléfono</p>
        <p className="text-sm text-muted-foreground">{phone || '15 3070-7350'}</p>
      </div>
      <div className="flex justify-between">
        <p className="text-sm font-medium">Email</p>
        <p className="text-sm text-muted-foreground">{email || 'swindoncollege2@gmail.com'}</p>
      </div>
    </>
  );
}

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
    whatsapp: metrics?.reduce((acc, m) => acc + (m.whatsappClicks || 0), 0) || 0,
  };

  const statCards = [
    { label: 'Total Contactos', value: stats.total, icon: Users, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { label: 'Nuevos Contactos', value: stats.nuevos, icon: MessageSquare, color: 'text-amber-600', bgColor: 'bg-amber-100' },
    { label: 'Reservas Totales', value: stats.reservas, icon: Clock, color: 'text-purple-600', bgColor: 'bg-purple-100' },
    { label: 'Clics WhatsApp', value: stats.whatsapp, icon: MessageCircle, color: 'text-green-600', bgColor: 'bg-green-100' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Resumen de actividad y métricas clave de tu academia.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <Card key={index} className="border-none shadow-sm bg-card/50 backdrop-blur-sm hover:shadow-md transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              <div className={cn('p-2.5 rounded-xl', stat.bgColor)}>
                <stat.icon className={cn('h-5 w-5', stat.color)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {index === 1 ? 'Pendientes de atención' : 'Datos actualizados'}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1 border-none shadow-sm overflow-hidden">
          <CardHeader className="bg-muted/30 pb-8">
            <CardTitle className="text-lg font-semibold">Tendencia de Vistas</CardTitle>
            <CardDescription>Visualizaciones de la página en los últimos 7 días</CardDescription>
          </CardHeader>
          <CardContent className="h-[320px] -mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => new Date(date).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis 
                  fontSize={12} 
                  tickLine={false}
                  axisLine={false}
                />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  labelFormatter={(date) => new Date(date).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
                />
                <Area 
                  type="monotone" 
                  dataKey="pageViews" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorViews)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1 border-none shadow-sm overflow-hidden">
          <CardHeader className="bg-muted/30 pb-8">
            <CardTitle className="text-lg font-semibold">Actividad de Contactos</CardTitle>
            <CardDescription>Comparativa entre consultas y reservas agendadas</CardDescription>
          </CardHeader>
          <CardContent className="h-[320px] -mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => new Date(date).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis 
                  fontSize={12} 
                  tickLine={false}
                  axisLine={false}
                />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="contactSubmissions" 
                  name="Consultas" 
                  stroke="#3b82f6" 
                  strokeWidth={3} 
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="appointmentBookings" 
                  name="Reservas" 
                  stroke="#8b5cf6" 
                  strokeWidth={3} 
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="whatsappClicks" 
                  name="WhatsApp" 
                  stroke="#22c55e" 
                  strokeWidth={3} 
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Reportes y Exportación</CardTitle>
            <CardDescription>Descarga los datos de tu academia en formato CSV</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="outline" 
                className="flex-1" 
                onClick={() => {
                  if (!contacts) return;
                  const headers = "Nombre,Email,Telefono,Tipo,Estado,Fecha\n";
                  const csv = contacts.map(c => `"${c.fullName}","${c.email}","${c.phone || ''}","${c.contactType}","${c.status}","${new Date(c.createdAt).toLocaleDateString()}"`).join("\n");
                  const blob = new Blob([headers + csv], { type: 'text/csv;charset=utf-8;' });
                  const link = document.createElement("a");
                  link.href = URL.createObjectURL(blob);
                  link.setAttribute("download", `contactos_newswindon_${new Date().toISOString().split('T')[0]}.csv`);
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  toast.success('Exportación de contactos iniciada');
                }}
              >
                <Users className="w-4 h-4 mr-2" />
                Exportar Contactos
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  if (!appointments) return;
                  const headers = "Nombre,Email,Telefono,Tipo,Fecha Cita,Estado\n";
                  const csv = appointments.map(a => `"${a.fullName}","${a.email}","${a.phone}","${a.appointmentType}","${new Date(a.appointmentDate).toLocaleString()}","${a.status}"`).join("\n");
                  const blob = new Blob([headers + csv], { type: 'text/csv;charset=utf-8;' });
                  const link = document.createElement("a");
                  link.href = URL.createObjectURL(blob);
                  link.setAttribute("download", `reservas_newswindon_${new Date().toISOString().split('T')[0]}.csv`);
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  toast.success('Exportación de reservas iniciada');
                }}
              >
                <Clock className="w-4 h-4 mr-2" />
                Exportar Reservas
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Acciones Rápidas</CardTitle>
            <CardDescription>Accesos directos a las herramientas de gestión</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-20 flex-col gap-2 hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all" asChild>
              <a href="/admin/contacts">
                <MessageSquare className="h-5 w-5" />
                <span>Contactos</span>
              </a>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all" asChild>
              <a href="/admin/appointments">
                <Clock className="h-5 w-5" />
                <span>Reservas</span>
              </a>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all" asChild>
              <a href="/admin/testimonials">
                <Star className="h-5 w-5" />
                <span>Testimonios</span>
              </a>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all" asChild>
              <a href="/admin/gallery">
                <ImageIcon className="h-5 w-5" />
                <span>Galería</span>
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
            <SiteInfoDisplay />
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
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Contactos</h1>
        <p className="text-muted-foreground">Gestiona los mensajes recibidos del formulario de contacto.</p>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-muted/30 border-b pb-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="flex flex-wrap gap-2">
              <Select 
                value={filters.status || 'all'} 
                onValueChange={(v) => setFilters({ ...filters, status: v === 'all' ? undefined : v as any })}
              >
                <SelectTrigger className="w-[160px] bg-background">
                  <SelectValue placeholder="Estado" />
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
                <SelectTrigger className="w-[140px] bg-background">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="empresa">Empresa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="relative w-full md:w-72">
              <Input 
                placeholder="Buscar por nombre o email..." 
                value={filters.search || ''}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="pl-9 bg-background"
              />
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/20">
              <TableRow>
                <TableHead className="pl-6">Nombre y Contacto</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Origen</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-right pr-6">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-20">
                    <div className="flex flex-col items-center gap-3">
                      <MessageSquare className="w-12 h-12 text-muted-foreground/20" />
                      <p className="text-lg font-medium text-muted-foreground">No hay contactos registrados</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                contacts?.map((contact) => (
                  <TableRow key={contact.id} className="hover:bg-muted/5 transition-colors">
                    <TableCell className="pl-6">
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground">{contact.fullName}</span>
                        <span className="text-xs text-muted-foreground">{contact.email}</span>
                        {contact.phone && <span className="text-[10px] text-muted-foreground/70">{contact.phone}</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={cn(
                        'px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider',
                        contact.contactType === 'empresa' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
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
                        <SelectTrigger className={cn(
                          "w-[140px] h-9 text-xs font-medium rounded-lg transition-all",
                          contact.status === 'nuevo' && "border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100",
                          contact.status === 'contactado' && "border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100",
                          contact.status === 'cerrado' && "border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100",
                          contact.status === 'en_proceso' && "border-purple-200 text-purple-700 bg-purple-50 hover:bg-purple-100"
                        )}>
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
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(contact.createdAt).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary"
                          onClick={() => handleEditContact(contact)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => {
                            if (confirm('¿Estás seguro de eliminar este contacto?')) {
                              deleteMutation.mutate({ id: contact.id });
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
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
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">Testimonios</h1>
          <p className="text-muted-foreground">Gestiona las opiniones de tus alumnos que se muestran en la web.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="rounded-xl shadow-sm">
              <Plus className="mr-2 h-4 w-4" />
              Agregar testimonio
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl">{editingTestimonial ? 'Editar' : 'Nuevo'} Testimonio</DialogTitle>
              <DialogDescription>
                {editingTestimonial ? 'Modifica los datos del testimonio existente.' : 'Agrega una nueva opinión para mostrar en el sitio.'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-5 py-4">
              <div className="grid gap-2">
                <Label htmlFor="authorName" className="text-sm font-semibold">Nombre del autor</Label>
                <Input
                  id="authorName"
                  value={formData.authorName}
                  onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                  placeholder="Ej: María González"
                  className="rounded-lg"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="authorRole" className="text-sm font-semibold">Rol o Descripción (opcional)</Label>
                <Input
                  id="authorRole"
                  value={formData.authorRole}
                  onChange={(e) => setFormData({ ...formData, authorRole: e.target.value })}
                  placeholder="Ej: Alumna de Nivel B2"
                  className="rounded-lg"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="content" className="text-sm font-semibold">Testimonio</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Escribe aquí lo que el alumno dijo sobre la academia..."
                  rows={4}
                  className="rounded-lg resize-none"
                />
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 grid gap-2">
                  <Label htmlFor="rating" className="text-sm font-semibold">Calificación</Label>
                  <Select
                    value={formData.rating.toString()}
                    onValueChange={(value) => setFormData({ ...formData, rating: parseInt(value) })}
                  >
                    <SelectTrigger className="rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[5, 4, 3, 2, 1].map((n) => (
                        <SelectItem key={n} value={n.toString()}>{n} estrellas</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <Switch
                    id="is-active"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
                  <Label htmlFor="is-active" className="text-sm font-semibold cursor-pointer">Visible</Label>
                </div>
              </div>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-lg">Cancelar</Button>
              <Button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending} className="rounded-lg px-8">
                {(createMutation.isPending || updateMutation.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {editingTestimonial ? 'Guardar cambios' : 'Publicar testimonio'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {testimonials?.length === 0 ? (
          <Card className="col-span-full border-dashed bg-muted/20 py-20">
            <CardContent className="flex flex-col items-center gap-3">
              <Star className="h-12 w-12 text-muted-foreground/20" />
              <p className="text-lg font-medium text-muted-foreground">No hay testimonios registrados</p>
              <Button variant="outline" onClick={() => setIsDialogOpen(true)} className="mt-2">
                Agregar el primero
              </Button>
            </CardContent>
          </Card>
        ) : (
          testimonials?.map((testimonial) => (
            <Card key={testimonial.id} className={cn(
              "group border-none shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden",
              !testimonial.isActive && 'opacity-60 grayscale-[0.5]'
            )}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-1">
                    <div className="flex gap-0.5 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            'h-3.5 w-3.5',
                            i < (testimonial.rating || 0) ? 'text-amber-400 fill-amber-400' : 'text-muted/30'
                          )}
                        />
                      ))}
                    </div>
                    <CardTitle className="text-base font-bold leading-tight">{testimonial.authorName}</CardTitle>
                    {testimonial.authorRole && (
                      <CardDescription className="text-xs font-medium text-primary/70">{testimonial.authorRole}</CardDescription>
                    )}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary" onClick={() => handleEdit(testimonial)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => {
                        if (confirm('¿Eliminar este testimonio?')) {
                          deleteMutation.mutate({ id: testimonial.id });
                        }
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground italic line-clamp-4">"{testimonial.content}"</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className={cn(
                    'text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full',
                    testimonial.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                  )}>
                    {testimonial.isActive ? 'Visible' : 'Oculto'}
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
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">Galería</h1>
          <p className="text-muted-foreground">Gestiona las fotos de las instalaciones y eventos de la academia.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="rounded-xl shadow-sm">
              <Plus className="mr-2 h-4 w-4" />
              Añadir Imagen
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[450px] rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl">{editingImage ? 'Editar' : 'Nueva'} Imagen</DialogTitle>
              <DialogDescription>Sube una imagen mediante URL para mostrarla en la web.</DialogDescription>
            </DialogHeader>
            <div className="space-y-5 py-4">
              <div className="grid gap-2">
                <Label htmlFor="url" className="text-sm font-semibold">URL de la imagen</Label>
                <Input
                  id="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://ejemplo.com/foto.jpg"
                  className="rounded-lg"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="caption" className="text-sm font-semibold">Pie de foto (opcional)</Label>
                <Input
                  id="caption"
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  placeholder="Ej: Entrega de certificados 2023"
                  className="rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="order" className="text-sm font-semibold">Orden</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
                    className="rounded-lg"
                  />
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <Switch
                    id="img-active"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
                  <Label htmlFor="img-active" className="text-sm font-semibold cursor-pointer">Activa</Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-lg">Cancelar</Button>
              <Button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending} className="rounded-lg px-8">
                {editingImage ? 'Guardar cambios' : 'Añadir a la galería'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images?.length === 0 ? (
          <Card className="col-span-full border-dashed bg-muted/20 py-20">
            <CardContent className="flex flex-col items-center gap-3">
              <ImageIcon className="h-12 w-12 text-muted-foreground/20" />
              <p className="text-lg font-medium text-muted-foreground">No hay imágenes en la galería</p>
            </CardContent>
          </Card>
        ) : (
          images?.map((image) => (
            <Card key={image.id} className={cn(
              "group border-none shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden",
              !image.isActive && 'opacity-60 grayscale-[0.5]'
            )}>
              <div className="aspect-video relative overflow-hidden">
                <img src={image.url} alt={image.caption || ''} className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button variant="secondary" size="icon" className="h-9 w-9 rounded-full" onClick={() => handleEdit(image)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="icon" className="h-9 w-9 rounded-full" onClick={() => {
                    if (confirm('¿Eliminar imagen?')) deleteMutation.mutate({ id: image.id });
                  }}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                {!image.isActive && (
                  <div className="absolute top-2 right-2 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    Inactiva
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <p className="text-sm font-semibold truncate text-foreground">{image.caption || <span className="text-muted-foreground/40 italic">Sin pie de foto</span>}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider bg-muted px-2 py-0.5 rounded">Posición: {image.displayOrder}</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

// Settings Management
function SettingsManagement() {
  const { data: adminEmail, refetch: refetchEmail } = trpc.settings.get.useQuery({ key: 'google_admin_email' });
  const { data: sitePhone, refetch: refetchPhone } = trpc.settings.get.useQuery({ key: 'site_phone' });
  const { data: siteEmail, refetch: refetchSiteEmail } = trpc.settings.get.useQuery({ key: 'site_email' });
  const { data: siteAddress, refetch: refetchAddress } = trpc.settings.get.useQuery({ key: 'site_address' });
  const { data: siteHours, refetch: refetchHours } = trpc.settings.get.useQuery({ key: 'site_hours' });
  const { data: featureChatbot, refetch: refetchChatbot } = trpc.settings.get.useQuery({ key: 'feature_chatbot' });
  const { data: featureInscriptions, refetch: refetchInscriptions } = trpc.settings.get.useQuery({ key: 'feature_inscriptions' });
  
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [sEmail, setSEmail] = useState('');
  const [address, setAddress] = useState('');
  const [hours, setHours] = useState('');

  useEffect(() => {
    if (adminEmail) setEmail(adminEmail);
    if (sitePhone) setPhone(sitePhone || '');
    if (siteEmail) setSEmail(siteEmail || '');
    if (siteAddress) setAddress(siteAddress || '');
    if (siteHours) setHours(siteHours || '');
  }, [adminEmail, sitePhone, siteEmail, siteAddress, siteHours]);

  const setSettingMutation = trpc.settings.set.useMutation({
    onSuccess: () => {
      toast.success('Configuración guardada');
      refetchEmail();
      refetchPhone();
      refetchSiteEmail();
      refetchAddress();
      refetchHours();
    },
  });

  const handleSaveCalendar = () => {
    if (!email || !email.includes('@')) {
      toast.error('Por favor ingresa un correo válido');
      return;
    }
    setSettingMutation.mutate({ key: 'google_admin_email', value: email });
  };

  const handleSaveSiteInfo = () => {
    setSettingMutation.mutate({ key: 'site_phone', value: phone });
    setSettingMutation.mutate({ key: 'site_email', value: sEmail });
    setSettingMutation.mutate({ key: 'site_address', value: address });
    setSettingMutation.mutate({ key: 'site_hours', value: hours });
  };

  const toggleFeature = (key: string, currentValue: string) => {
    const newValue = currentValue === 'true' ? 'false' : 'true';
    setSettingMutation.mutate({ key, value: newValue });
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
            <SettingsIcon className="w-5 h-5 text-primary" />
            <CardTitle>Información del Sitio</CardTitle>
          </div>
          <CardDescription>
            Datos de contacto que se muestran en todo el sitio web.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="site-phone">Teléfono de Contacto</Label>
            <Input
              id="site-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="15 3070-7350"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="site-email">Email de Contacto</Label>
            <Input
              id="site-email"
              type="email"
              value={sEmail}
              onChange={(e) => setSEmail(e.target.value)}
              placeholder="swindoncollege2@gmail.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="site-address">Dirección</Label>
            <Input
              id="site-address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Ej: Av. Santa Fe 1234, CABA"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="site-hours">Horarios de Atención</Label>
            <Input
              id="site-hours"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              placeholder="Ej: Lunes a Viernes 9:00 - 20:00"
            />
          </div>
          <Button onClick={handleSaveSiteInfo} disabled={setSettingMutation.isPending} className="w-full md:w-auto">
            {setSettingMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Guardar Información del Sitio
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-primary" />
            <CardTitle>Control de Funciones (Feature Flags)</CardTitle>
          </div>
          <CardDescription>
            Activa o desactiva funcionalidades del sitio en tiempo real.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border">
            <div className="space-y-0.5">
              <Label className="text-base font-bold">Asistente Virtual (Chatbot)</Label>
              <p className="text-sm text-muted-foreground">Habilita el chatbot de consultas automáticas en la web.</p>
            </div>
            <Switch 
              checked={featureChatbot === 'true'} 
              onCheckedChange={() => toggleFeature('feature_chatbot', featureChatbot || 'false')}
              disabled={setSettingMutation.isPending}
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border">
            <div className="space-y-0.5">
              <Label className="text-base font-bold">Inscripciones Abiertas</Label>
              <p className="text-sm text-muted-foreground">Muestra el formulario de contacto y reserva de entrevistas.</p>
            </div>
            <Switch 
              checked={featureInscriptions === 'true'} 
              onCheckedChange={() => toggleFeature('feature_inscriptions', featureInscriptions || 'false')}
              disabled={setSettingMutation.isPending}
            />
          </div>
        </CardContent>
      </Card>

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
          <Button onClick={handleSaveCalendar} disabled={setSettingMutation.isPending}>
            {setSettingMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Guardar Configuración de Calendario
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
                          href={`https://wa.me/${appointment.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`¡Hola ${appointment.fullName}! Te escribimos de NewSwindon para recordarte tu cita agendada para el ${new Date(appointment.appointmentDate).toLocaleString('es-AR')}. ¡Te esperamos!`)}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                        >
                          <MessageCircle className="w-4 h-4 mr-1" />
                          Recordar
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

  if (user?.role !== 'admin' && user?.role !== 'super_admin') {
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
