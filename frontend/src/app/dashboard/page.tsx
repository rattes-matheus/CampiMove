'use client';

import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { DashboardHeader } from '@/components/dashboard/header';
import { Footer } from '@/components/landing/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
    Trash2, UserX, PlusCircle, CheckCircle, MoreVertical, Edit,
    Ban, Bus, Users as UsersIcon, Calendar, Bell, AlertTriangle, Users, ShieldX,
    Loader2, AlertCircle, Star
} from 'lucide-react';
import axios from "axios";

interface UserReport {
    id: number;
    userid: number;
    driverName: string;
    report_text: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    active: boolean;
}

interface IntercampiRoute {
    id: number;
    route: string;
    schedule: string;
}

interface BusType {
    id: number;
    plate: string;
    company: string;
    capacity: number;
    model: string;
    year: number;
    active: boolean;
    driverId?: number;
    driverName?: string;
}

interface DriverType {
    id: number;
    name: string;
    email: string;
    phoneNumber: string;
    rating: number;
    licenseNumber?: string;
    licenseCategory?: string;
    profilePictureUrl?: string;
    active: boolean;
}

export default function AdminDashboardPage() {
    const { toast } = useToast();
    const router = useRouter();

    const [loading, setLoading] = useState({
        schedules: false,
        buses: false,
        drivers: false,
        reports: false,
        users: false,
        stats: false
    });

    const [schedules, setSchedules] = useState<IntercampiRoute[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [reports, setReports] = useState<UserReport[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [notification, setNotification] = useState('');
    const [modified, setModified] = useState(0);

    const [newRoute, setNewRoute] = useState('');
    const [newTime, setNewTime] = useState('');
    const [editingRoute, setEditingRoute] = useState<IntercampiRoute | null>(null);
    const [editRoute, setEditRoute] = useState('');
    const [editTime, setEditTime] = useState('');
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const [buses, setBuses] = useState<BusType[]>([]);
    const [newBus, setNewBus] = useState({
        plate: '',
        company: '',
        capacity: '',
        model: '',
        year: '',
        driverId: ''
    });

    const [drivers, setDrivers] = useState<DriverType[]>([]);
    const [availableDrivers, setAvailableDrivers] = useState<DriverType[]>([]);

    // Estado para novo motorista - ADICIONADO
    const [newDriver, setNewDriver] = useState({
        name: '',
        email: '',
        phone: '',
        licenseNumber: '',  // CNH
        licenseCategory: 'D',
        age: '',
        password: 'Senha123@'  // Senha padrão
    });

    const [activeTab, setActiveTab] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('adminActiveTab') || 'horarios';
        }
        return 'horarios';
    });

    const handleTabChange = (value: string) => {
        setActiveTab(value);
        if (typeof window !== 'undefined') {
            localStorage.setItem('adminActiveTab', value);
        }
    };

    const api = axios.create({
        baseURL: 'http://localhost:8080'
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                await Promise.all([
                    fetchSchedules(),
                    fetchReports(),
                    fetchUsers(),
                    fetchBuses(),
                    fetchDrivers(),
                    fetchStats()
                ]);
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
                toast({
                    title: "Erro",
                    description: "Não foi possível carregar os dados do painel.",
                    variant: "destructive"
                });
            }
        };

        fetchData();
    }, [modified]);

    const fetchSchedules = async () => {
        setLoading(prev => ({ ...prev, schedules: true }));
        try {
            const response = await api.get("/api/routes");
            setSchedules(response.data);
        } catch (error: any) {
            console.error("Erro ao buscar horários:", error);
            toast({
                title: "Erro",
                description: error.response?.data?.message || "Falha ao carregar horários",
                variant: "destructive"
            });
        } finally {
            setLoading(prev => ({ ...prev, schedules: false }));
        }
    };

    const fetchReports = async () => {
        setLoading(prev => ({ ...prev, reports: true }));
        try {
            const response = await api.get("/api/admin/reports");
            setReports(response.data);
        } catch (error: any) {
            console.error("Erro ao buscar denúncias:", error);
        } finally {
            setLoading(prev => ({ ...prev, reports: false }));
        }
    };

    const fetchUsers = async () => {
        setLoading(prev => ({ ...prev, users: true }));
        try {
            const response = await api.get("/api/admin/show-users");
            setUsers(response.data);
        } catch (error: any) {
            console.error("Erro ao buscar usuários:", error);
        } finally {
            setLoading(prev => ({ ...prev, users: false }));
        }
    };

    const fetchBuses = async () => {
        setLoading(prev => ({ ...prev, buses: true }));
        try {
            const response = await api.get("/api/buses");
            setBuses(response.data);
        } catch (error: any) {
            console.error("Erro ao buscar ônibus:", error);
            toast({
                title: "Aviso",
                description: "Endpoint de ônibus pode não estar implementado",
                variant: "default"
            });
        } finally {
            setLoading(prev => ({ ...prev, buses: false }));
        }
    };

    // FUNÇÃO fetchDrivers CORRIGIDA - ADICIONADA
    const fetchDrivers = async () => {
        setLoading(prev => ({ ...prev, drivers: true }));
        try {
            const driversResponse = await api.get("/api/admin/drivers");
            const driversData = driversResponse.data;

            // Mapear corretamente os campos
            const mappedDrivers = driversData.map((driver: any) => ({
                id: driver.id,
                name: driver.name,
                email: driver.email,
                phoneNumber: driver.phoneNumber || driver.phone || '-',  // Usa phoneNumber ou phone
                licenseNumber: driver.licenseNumber || 'Não informada',
                rating: driver.rating || 0.0,
                active: driver.active !== false  // default true
            }));

            setDrivers(mappedDrivers);

            // Para dropdown, filtra apenas ativos
            const activeDrivers = mappedDrivers.filter((d: DriverType) => d.active);
            setAvailableDrivers(activeDrivers);

        } catch (error: any) {
            console.error("Erro ao buscar motoristas:", error);
            toast({
                title: "Erro",
                description: "Não foi possível carregar a lista de motoristas",
                variant: "destructive"
            });
        } finally {
            setLoading(prev => ({ ...prev, drivers: false }));
        }
    };

    const fetchStats = async () => {
        setLoading(prev => ({ ...prev, stats: true }));
        try {
            const response = await api.get("/api/admin/stats");
            setStats(response.data);
        } catch (error: any) {
            console.error("Erro ao buscar estatísticas:", error);
        } finally {
            setLoading(prev => ({ ...prev, stats: false }));
        }
    };

    // FUNÇÃO handleAddDriver - ADICIONADA
    const handleAddDriver = async () => {
        if (!newDriver.name || !newDriver.email || !newDriver.licenseNumber) {
            toast({
                title: "Erro",
                description: "Preencha os campos obrigatórios (Nome, Email, CNH).",
                variant: "destructive"
            });
            return;
        }

        try {
            const response = await api.post("/api/drivers", {
                name: newDriver.name,
                email: newDriver.email,
                phone: newDriver.phone,
                licenseNumber: newDriver.licenseNumber,
                licenseCategory: newDriver.licenseCategory,
                age: parseInt(newDriver.age) || 30,
                password: newDriver.password || "Senha123@"
            });

            toast({
                title: "Sucesso",
                description: "Motorista cadastrado com sucesso!"
            });

            // Limpar formulário
            setNewDriver({
                name: '',
                email: '',
                phone: '',
                licenseNumber: '',
                licenseCategory: 'D',
                age: '',
                password: 'Senha123@'
            });

            // Atualizar lista de motoristas
            fetchDrivers();

        } catch (error: any) {
            console.error("Erro ao cadastrar motorista:", error);
            toast({
                title: "Erro",
                description: error.response?.data?.error || "Falha no cadastro do motorista",
                variant: "destructive"
            });
        }
    };

    const handleAddSchedule = async () => {
        if (!newRoute.trim() || !newTime) {
            toast({
                title: "Erro",
                description: "Preencha a rota e o horário.",
                variant: "destructive"
            });
            return;
        }

        try {
            await api.post("/api/routes/save", {
                route: newRoute,
                schedule: newTime
            });

            toast({ title: "Sucesso", description: "Horário adicionado com sucesso!" });
            setNewRoute('');
            setNewTime('');
            fetchSchedules();
        } catch (error: any) {
            console.error("Erro ao adicionar horário:", error);
            toast({
                title: "Erro",
                description: error.response?.data?.message || "Erro ao adicionar horário",
                variant: "destructive"
            });
        }
    };

    const handleEditSchedule = async () => {
        if (!editingRoute || !editRoute.trim() || !editTime) {
            toast({
                title: "Erro",
                description: "Preencha todos os campos.",
                variant: "destructive"
            });
            return;
        }

        try {
            await api.put(`/api/routes/update/${editingRoute.id}`, {
                route: editRoute,
                schedule: editTime
            });

            toast({ title: "Sucesso", description: "Horário atualizado com sucesso!" });
            setEditingRoute(null);
            setEditRoute('');
            setEditTime('');
            setIsEditDialogOpen(false);
            fetchSchedules();
        } catch (error: any) {
            console.error("Erro ao atualizar horário:", error);
            toast({
                title: "Erro",
                description: error.response?.data?.message || "Erro ao atualizar horário",
                variant: "destructive"
            });
        }
    };

    const handleDeleteSchedule = async (id: number) => {
        if (!confirm("Tem certeza que deseja excluir este horário?")) return;

        try {
            await api.post("/api/routes/delete", { id });
            toast({ title: "Sucesso", description: "Horário removido com sucesso!" });
            fetchSchedules();
        } catch (error: any) {
            console.error("Erro ao remover horário:", error);
            toast({
                title: "Erro",
                description: error.response?.data?.message || "Erro ao remover horário",
                variant: "destructive"
            });
        }
    };

    const handleDeleteAllSchedules = async () => {
        if (!confirm("Tem certeza que deseja excluir TODOS os horários? Esta ação não pode ser desfeita.")) {
            return;
        }

        try {
            await api.delete("/api/routes/delete-all");
            toast({ title: "Sucesso", description: "Todos os horários foram excluídos!" });
            fetchSchedules();
        } catch (error: any) {
            console.error("Erro ao excluir horários:", error);
            toast({
                title: "Erro",
                description: error.response?.data?.message || "Erro ao excluir horários",
                variant: "destructive"
            });
        }
    };

    const handleAddBus = async () => {
        if (!newBus.plate.trim()) {
            toast({ title: "Erro", description: "Placa é obrigatória!", variant: "destructive" });
            return;
        }

        if (!newBus.company.trim()) {
            toast({ title: "Erro", description: "Empresa é obrigatória!", variant: "destructive" });
            return;
        }

        try {
            const busData: any = {
                plate: newBus.plate.toUpperCase(),
                company: newBus.company,
                capacity: parseInt(newBus.capacity),
                model: newBus.model,
                year: parseInt(newBus.year)
            };

            if (newBus.driverId) {
                busData.driverId = parseInt(newBus.driverId);
            }

            await api.post("/api/buses", busData);

            toast({ title: "Sucesso", description: "Ônibus cadastrado!" });
            setNewBus({ plate: '', company: '', capacity: '', model: '', year: '', driverId: '' });
            fetchBuses();
        } catch (error: any) {
            console.error("Erro ao cadastrar ônibus:", error);
            toast({
                title: "Erro",
                description: error.response?.data?.message || "Falha no cadastro",
                variant: "destructive"
            });
        }
    };

    const handleDeleteBus = async (id: number) => {
        if (!confirm("Tem certeza que deseja excluir este ônibus?")) return;

        try {
            await api.delete(`/api/buses/${id}`);
            setBuses(buses.filter(b => b.id !== id));
            toast({ title: "Sucesso", description: "Ônibus excluído!" });
        } catch (error: any) {
            console.error("Erro ao excluir ônibus:", error);
            toast({
                title: "Erro",
                description: error.response?.data?.message || "Erro ao excluir ônibus",
                variant: "destructive"
            });
        }
    };

    const handleDeleteDriver = async (id: number) => {
        if (!confirm("Tem certeza que deseja excluir este motorista?")) return;

        try {
            await api.delete(`/api/drivers/${id}`);
            toast({ title: "Sucesso", description: "Motorista excluído!" });
            fetchDrivers();
        } catch (error: any) {
            console.error("Erro ao excluir motorista:", error);
            toast({
                title: "Erro",
                description: error.response?.data?.message || "Erro ao excluir motorista",
                variant: "destructive"
            });
        }
    };

    const handleDismissReport = async (id: number) => {
        try {
            await api.delete(`/api/admin/reports/actions/${id}/ignore`);
            toast({ title: 'Sucesso', description: 'Denúncia dispensada.' });
            setModified(prev => prev + 1);
        } catch (error) {
            toast({ title: 'Erro', description: 'Erro ao dispensar denúncia.', variant: 'destructive' });
        }
    };

    const handleBanUserFromReport = async (reportId: number, userId: number) => {
        try {
            await api.post(`/api/admin/reports/actions/${userId}/${reportId}/disable-from-report`);
            toast({ title: "Sucesso", description: "Usuário banido." });
            setModified(prev => prev + 1);
        } catch (error) {
            toast({ title: 'Erro', description: 'Erro ao banir usuário.', variant: 'destructive' });
        }
    };

    const handleBanUser = async (userId: number) => {
        try {
            await api.post(`/api/admin/reports/actions/${userId}/disable-user`);
            toast({ title: "Sucesso", description: "Usuário banido." });
            setModified(prev => prev + 1);
        } catch (error) {
            toast({ title: 'Erro', description: 'Erro ao banir usuário.', variant: 'destructive' });
        }
    };

    const handleUnbanUser = async (userId: number) => {
        try {
            await api.post(`/api/admin/reports/actions/${userId}/enable-user`);
            toast({ title: "Sucesso", description: "Usuário reativado." });
            setModified(prev => prev + 1);
        } catch (error) {
            toast({ title: 'Erro', description: 'Erro ao reativar usuário.', variant: 'destructive' });
        }
    };

    const handleSendNotification = () => {
        if (notification.trim()) {
            toast({ title: 'Sucesso', description: 'Notificação enviada.' });
            setNotification('');
        } else {
            toast({ title: 'Erro', description: 'A notificação não pode estar vazia.', variant: 'destructive' });
        }
    };

    const handleOpenEditDialog = (schedule: IntercampiRoute) => {
        setEditingRoute(schedule);
        setEditRoute(schedule.route);
        setEditTime(schedule.schedule);
        setIsEditDialogOpen(true);
    };

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <DashboardHeader />
            <main className="flex-grow container mx-auto px-4 md:px-6 py-8">
                <h1 className="text-3xl font-bold mb-8">Painel do Administrador</h1>

                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Total de Usuários</p>
                                        <p className="text-2xl font-bold">{stats.totalUsers || 0}</p>
                                    </div>
                                    <Users className="h-8 w-8 text-primary" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Ônibus Ativos</p>
                                        <p className="text-2xl font-bold">{stats.activeBuses || 0} / {stats.totalBuses || 0}</p>
                                    </div>
                                    <Bus className="h-8 w-8 text-primary" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Denúncias Pendentes</p>
                                        <p className="text-2xl font-bold">{stats.totalReports || 0}</p>
                                    </div>
                                    <AlertTriangle className="h-8 w-8 text-primary" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-8">
                    <TabsList className="grid grid-cols-3 md:grid-cols-6">
                        <TabsTrigger value="horarios" className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4" /> Horários
                        </TabsTrigger>
                        <TabsTrigger value="onibus" className="flex items-center">
                            <Bus className="mr-2 h-4 w-4" /> Ônibus
                        </TabsTrigger>
                        <TabsTrigger value="motoristas" className="flex items-center">
                            <UsersIcon className="mr-2 h-4 w-4" /> Motoristas
                        </TabsTrigger>
                        <TabsTrigger value="denuncias" className="flex items-center">
                            <AlertTriangle className="mr-2 h-4 w-4" /> Denúncias
                        </TabsTrigger>
                        <TabsTrigger value="usuarios" className="flex items-center">
                            <Users className="mr-2 h-4 w-4" /> Usuários
                        </TabsTrigger>
                        <TabsTrigger value="notificacoes" className="flex items-center">
                            <Bell className="mr-2 h-4 w-4" /> Notificações
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="horarios">
                        <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle>Gerenciar Horários do Intercampus</CardTitle>
                                        <CardDescription>Adicione, edite ou remova horários.</CardDescription>
                                    </div>
                                    <Button variant="destructive" onClick={handleDeleteAllSchedules}>
                                        <Trash2 className="mr-2 h-4 w-4" /> Remover Todos
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    <div className="mb-4">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button><PlusCircle className="mr-2" /> Adicionar Horário</Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Adicionar Novo Horário</DialogTitle>
                                                </DialogHeader>
                                                <div className="grid gap-4 py-4">
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="route" className="text-right">Rota</Label>
                                                        <Input
                                                            id="route"
                                                            value={newRoute}
                                                            onChange={(e) => setNewRoute(e.target.value)}
                                                            className="col-span-3"
                                                            placeholder="Ex: Campus Central → Campus Norte"
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="time" className="text-right">Horário</Label>
                                                        <Input
                                                            id="time"
                                                            type="time"
                                                            value={newTime}
                                                            onChange={(e) => setNewTime(e.target.value)}
                                                            className="col-span-3"
                                                        />
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <DialogClose asChild>
                                                        <Button type="button" onClick={handleAddSchedule}>Salvar</Button>
                                                    </DialogClose>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </div>

                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Rota</TableHead>
                                                <TableHead>Horário</TableHead>
                                                <TableHead className="text-right">Ações</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {loading.schedules ? (
                                                <TableRow>
                                                    <TableCell colSpan={3} className="text-center">
                                                        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                                                    </TableCell>
                                                </TableRow>
                                            ) : schedules.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                                                        Nenhum horário cadastrado ainda.
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                schedules.map(schedule => (
                                                    <TableRow key={schedule.id}>
                                                        <TableCell>{schedule.route}</TableCell>
                                                        <TableCell>{schedule.schedule}</TableCell>
                                                        <TableCell className="text-right space-x-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleOpenEditDialog(schedule)}
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleDeleteSchedule(schedule.id)}
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

                            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Editar Horário</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="edit-route" className="text-right">Rota</Label>
                                            <Input
                                                id="edit-route"
                                                value={editRoute}
                                                onChange={(e) => setEditRoute(e.target.value)}
                                                className="col-span-3"
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="edit-time" className="text-right">Horário</Label>
                                            <Input
                                                id="edit-time"
                                                type="time"
                                                value={editTime}
                                                onChange={(e) => setEditTime(e.target.value)}
                                                className="col-span-3"
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                            Cancelar
                                        </Button>
                                        <Button onClick={handleEditSchedule}>
                                            Salvar Alterações
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </TabsContent>

                    <TabsContent value="onibus">
                        <div className="grid gap-8">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Bus className="mr-2" /> Gerenciar Ônibus
                                    </CardTitle>
                                    <CardDescription>Cadastre e gerencie a frota de ônibus.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="mb-4">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button><PlusCircle className="mr-2" /> Adicionar Ônibus</Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[425px]">
                                                <DialogHeader>
                                                    <DialogTitle>Cadastrar Novo Ônibus</DialogTitle>
                                                </DialogHeader>
                                                <div className="grid gap-4 py-4">
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="plate" className="text-right">Placa*</Label>
                                                        <Input
                                                            id="plate"
                                                            value={newBus.plate}
                                                            onChange={(e) => setNewBus({...newBus, plate: e.target.value})}
                                                            className="col-span-3"
                                                            placeholder="Ex: ABC-1234"
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="company" className="text-right">Empresa*</Label>
                                                        <Input
                                                            id="company"
                                                            value={newBus.company}
                                                            onChange={(e) => setNewBus({...newBus, company: e.target.value})}
                                                            className="col-span-3"
                                                            placeholder="Ex: Viação Campus Express"
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="model" className="text-right">Modelo</Label>
                                                        <Input
                                                            id="model"
                                                            value={newBus.model}
                                                            onChange={(e) => setNewBus({...newBus, model: e.target.value})}
                                                            className="col-span-3"
                                                            placeholder="Ex: Mercedes-Benz O-500U"
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="capacity" className="text-right">Capacidade</Label>
                                                        <Input
                                                            id="capacity"
                                                            type="number"
                                                            value={newBus.capacity}
                                                            onChange={(e) => setNewBus({...newBus, capacity: e.target.value})}
                                                            className="col-span-3"
                                                            placeholder="Ex: 50"
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="year" className="text-right">Ano</Label>
                                                        <Input
                                                            id="year"
                                                            type="number"
                                                            value={newBus.year}
                                                            onChange={(e) => setNewBus({...newBus, year: e.target.value})}
                                                            className="col-span-3"
                                                            placeholder="Ex: 2023"
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="driverId" className="text-right">Motorista</Label>
                                                        <select
                                                            id="driverId"
                                                            value={newBus.driverId}
                                                            onChange={(e) => setNewBus({...newBus, driverId: e.target.value})}
                                                            className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                        >
                                                            <option value="">Nenhum</option>
                                                            {availableDrivers.map(driver => (
                                                                <option key={driver.id} value={driver.id}>
                                                                    {driver.name} ({driver.licenseNumber})
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <DialogClose asChild>
                                                        <Button type="button" onClick={handleAddBus}>Salvar</Button>
                                                    </DialogClose>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Placa</TableHead>
                                                <TableHead>Empresa</TableHead>
                                                <TableHead>Modelo</TableHead>
                                                <TableHead>Capacidade</TableHead>
                                                <TableHead>Ano</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="text-right">Ações</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {loading.buses ? (
                                                <TableRow>
                                                    <TableCell colSpan={7} className="text-center">
                                                        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                                                    </TableCell>
                                                </TableRow>
                                            ) : buses.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                                                        Nenhum ônibus cadastrado.
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                buses.map(bus => (
                                                    <TableRow key={bus.id}>
                                                        <TableCell className="font-medium">{bus.plate}</TableCell>
                                                        <TableCell>{bus.company}</TableCell>
                                                        <TableCell>{bus.model || '-'}</TableCell>
                                                        <TableCell>{bus.capacity || '-'}</TableCell>
                                                        <TableCell>{bus.year || '-'}</TableCell>
                                                        <TableCell>
                                    <span className={`px-2 py-1 rounded text-xs ${bus.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                      {bus.active ? 'Ativo' : 'Inativo'}
                                    </span>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <Button variant="ghost" size="icon" onClick={() => handleDeleteBus(bus.id)}>
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
                    </TabsContent>

                    <TabsContent value="motoristas">
                        <div className="grid gap-8">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <UsersIcon className="mr-2" /> Gerenciar Motoristas
                                    </CardTitle>
                                    <CardDescription>Cadastre e gerencie os motoristas.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="mb-4">
                                        {/* MODAL DE CADASTRO DE MOTORISTA - ADICIONADO */}
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button><PlusCircle className="mr-2" /> Adicionar Motorista</Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[425px]">
                                                <DialogHeader>
                                                    <DialogTitle>Cadastrar Novo Motorista</DialogTitle>
                                                </DialogHeader>
                                                <div className="grid gap-4 py-4">
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="driver-name" className="text-right">Nome*</Label>
                                                        <Input
                                                            id="driver-name"
                                                            value={newDriver.name}
                                                            onChange={(e) => setNewDriver({...newDriver, name: e.target.value})}
                                                            className="col-span-3"
                                                            placeholder="Nome completo"
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="driver-email" className="text-right">Email*</Label>
                                                        <Input
                                                            id="driver-email"
                                                            type="email"
                                                            value={newDriver.email}
                                                            onChange={(e) => setNewDriver({...newDriver, email: e.target.value})}
                                                            className="col-span-3"
                                                            placeholder="exemplo@email.com"
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="driver-phone" className="text-right">Telefone</Label>
                                                        <Input
                                                            id="driver-phone"
                                                            value={newDriver.phone}
                                                            onChange={(e) => setNewDriver({...newDriver, phone: e.target.value})}
                                                            className="col-span-3"
                                                            placeholder="(11) 99999-9999"
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="driver-cnh" className="text-right">CNH*</Label>
                                                        <Input
                                                            id="driver-cnh"
                                                            value={newDriver.licenseNumber}
                                                            onChange={(e) => setNewDriver({...newDriver, licenseNumber: e.target.value})}
                                                            className="col-span-3"
                                                            placeholder="Número da CNH"
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="driver-category" className="text-right">Categoria</Label>
                                                        <select
                                                            id="driver-category"
                                                            value={newDriver.licenseCategory}
                                                            onChange={(e) => setNewDriver({...newDriver, licenseCategory: e.target.value})}
                                                            className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                        >
                                                            <option value="A">A - Motocicleta</option>
                                                            <option value="B">B - Carro</option>
                                                            <option value="C">C - Caminhão</option>
                                                            <option value="D">D - Ônibus</option>
                                                            <option value="E">E - Reboque</option>
                                                        </select>
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="driver-age" className="text-right">Idade</Label>
                                                        <Input
                                                            id="driver-age"
                                                            type="number"
                                                            value={newDriver.age}
                                                            onChange={(e) => setNewDriver({...newDriver, age: e.target.value})}
                                                            className="col-span-3"
                                                            placeholder="30"
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="driver-password" className="text-right">Senha*</Label>
                                                        <Input
                                                            id="driver-password"
                                                            type="password"
                                                            value={newDriver.password}
                                                            onChange={(e) => setNewDriver({...newDriver, password: e.target.value})}
                                                            className="col-span-3"
                                                            placeholder="Senha temporária"
                                                        />
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <DialogClose asChild>
                                                        <Button type="button" onClick={handleAddDriver}>Salvar</Button>
                                                    </DialogClose>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </div>

                                    {/* TABELA DE MOTORISTAS - ATUALIZADA */}
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Nome</TableHead>
                                                <TableHead>Email</TableHead>
                                                <TableHead>Telefone</TableHead>
                                                <TableHead>CNH</TableHead>
                                                <TableHead>Avaliação</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="text-right">Ações</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {loading.drivers ? (
                                                <TableRow>
                                                    <TableCell colSpan={7} className="text-center">
                                                        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                                                    </TableCell>
                                                </TableRow>
                                            ) : drivers.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                                                        Nenhum motorista cadastrado.
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                drivers.map(driver => (
                                                    <TableRow key={driver.id}>
                                                        <TableCell className="font-medium">{driver.name}</TableCell>
                                                        <TableCell>{driver.email}</TableCell>
                                                        <TableCell>{driver.phoneNumber}</TableCell>
                                                        <TableCell>{driver.licenseNumber}</TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center">
                                                                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                                                                {driver.rating.toFixed(1)}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                    <span className={`px-2 py-1 rounded text-xs ${
                                        driver.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                      {driver.active ? 'Ativo' : 'Inativo'}
                                    </span>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => handleDeleteDriver(driver.id)}
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
                    </TabsContent>

                    <TabsContent value="denuncias">
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle>Denúncias</CardTitle>
                                <CardDescription>Gerencie denúncias contra motoristas.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="max-h-80 overflow-y-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Motorista</TableHead>
                                                <TableHead>Motivo</TableHead>
                                                <TableHead className="text-right">Ações</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {loading.reports ? (
                                                <TableRow>
                                                    <TableCell colSpan={3} className="text-center">
                                                        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                                                    </TableCell>
                                                </TableRow>
                                            ) : reports.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                                                        Nenhuma denúncia pendente.
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                reports.map(report => (
                                                    <TableRow key={report.id}>
                                                        <TableCell>{report.driverName}</TableCell>
                                                        <TableCell>{report.report_text}</TableCell>
                                                        <TableCell className="text-right space-x-2">
                                                            <Button variant="ghost" size="sm" onClick={() => handleDismissReport(report.id)}>
                                                                <CheckCircle className="mr-2 h-4 w-4 text-green-500" /> Dispensar
                                                            </Button>
                                                            <Button variant="destructive" size="sm" onClick={() => handleBanUserFromReport(report.id, report.userid)}>
                                                                <UserX className="mr-2 h-4 w-4" /> Banir
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="usuarios">
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle>Gerenciar Usuários</CardTitle>
                                <CardDescription>Banir ou reativar usuários</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="max-h-80 overflow-y-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Nome</TableHead>
                                                <TableHead>Email</TableHead>
                                                <TableHead>Tipo</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="text-right">Ação</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {loading.users ? (
                                                <TableRow>
                                                    <TableCell colSpan={5} className="text-center">
                                                        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                                                    </TableCell>
                                                </TableRow>
                                            ) : users.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                                                        Nenhum usuário encontrado.
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                users.map(user => (
                                                    <TableRow key={user.id}>
                                                        <TableCell>{user.name}</TableCell>
                                                        <TableCell>{user.email}</TableCell>
                                                        <TableCell>{user.role}</TableCell>
                                                        <TableCell>
                                    <span className={`px-2 py-1 rounded text-xs ${user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                      {user.active ? 'Ativo' : 'Banido'}
                                    </span>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            {user.role === "ADMIN" ? (
                                                                <Button variant="secondary" size="sm" disabled>
                                                                    <ShieldX className="mr-2 h-4 w-4" /> Admin
                                                                </Button>
                                                            ) : user.active ? (
                                                                <Button variant="destructive" size="sm" onClick={() => handleBanUser(user.id)}>
                                                                    <Ban className="mr-2 h-4 w-4" /> Banir
                                                                </Button>
                                                            ) : (
                                                                <Button variant="default" size="sm" onClick={() => handleUnbanUser(user.id)}>
                                                                    Reativar
                                                                </Button>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="notificacoes">
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle>Enviar Notificação</CardTitle>
                                <CardDescription>Mensagem global para todos os usuários</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Textarea
                                    placeholder="Digite sua mensagem..."
                                    value={notification}
                                    onChange={(e) => setNotification(e.target.value)}
                                    rows={5}
                                />
                                <Button className="w-full" onClick={handleSendNotification}>Enviar</Button>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>
            <Footer />
        </div>
    );
}